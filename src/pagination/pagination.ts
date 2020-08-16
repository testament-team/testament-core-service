import { NotFoundException } from '@nestjs/common';
import { AnyParamConstructor, ReturnModelType } from '@typegoose/typegoose/lib/types';

export interface Sort {
    [key: string]: 1 | -1;
}

export interface Page<T> {
    content: T[];
    elements: number;
    page: number;
    limit: number;
    totalPages: number;
    totalElements: number;
    firstPage: boolean;
    lastPage: boolean;
    sort?: Sort;
}

export interface PageOptions {
    page?: number;
    limit?: number;
    before?: string;
    after?: string;
    sort?: Sort;
}

export function parseSort(sort: string): Sort {
    const result: Sort = {};
    for(const token of sort.split(",")) {
        if(token.charAt(0) === "-") {
            result[token.substring(1)] = -1;
        } else {
            result[token] = 1;
        } 
    }
    return result;
}

export function getPageOptions(query: any): PageOptions {
    const pageOptions: PageOptions = {
        before: query.before,
        after: query.after
    };
    if(query.page) {
        pageOptions.page = parseInt(query.page);
    }
    if(query.limit) {
        pageOptions.limit = parseInt(query.limit);
    }
    if(query.sort) {
        pageOptions.sort = parseSort(query.sort);
    }
    return pageOptions;
}

export async function paginate<T>(model: ReturnModelType<AnyParamConstructor<T>>, query: Object, pageOptions: PageOptions): Promise<Page<T>> {
    const page: number = pageOptions.page >= 0 ? pageOptions.page : 0;
    const limit: number = pageOptions.limit < 50 ? pageOptions.limit : 50;
    const skip: number = page * limit;
    let { after, before, sort = {} } = pageOptions;
    const filter: any = Object.assign({}, query);
    delete filter.page;
    delete filter.limit;
    delete filter.after;
    delete filter.before;
    delete filter.sort;
    if(before) {
        filter._id = { $lt: before };
    } else if(after) {
        filter._id = { $gt: after };
    } 
    
    const totalElements: number = await model.countDocuments(filter).exec();
    const totalPages: number = Math.max(1, Math.ceil(totalElements / limit));
    if(page >= totalPages) {
        throw new NotFoundException("Page not found");
    }
    const content: T[] = await model.find(filter).limit(limit).skip(skip).sort(sort).exec();

    const formattedSort: any = {};
    for(const [key, value] of Object.entries(sort)) {
        formattedSort[key] = value === 1 ? "asc" : "desc";
    }

    return {
        content: content,
        elements: content.length,
        page: page,
        limit: limit,
        totalPages: totalPages,
        totalElements: totalElements,
        firstPage: page === 0,
        lastPage: page === totalPages - 1,
        sort: pageOptions.sort ? formattedSort : null
    }
}