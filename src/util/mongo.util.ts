export function $set(update: any, name: string, value: any) {
    if(!update.$set) {
        update.$set = {};
    }
    if(value !== undefined) {
        update.$set[name] = value;
    }
}