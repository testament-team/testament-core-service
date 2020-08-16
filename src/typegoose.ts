import { setGlobalOptions } from "@typegoose/typegoose";

export function getSharedModelOptions() {
    const reshapingOptions = { 
      virtuals: true, 
      transform: function (doc, ret) { 
        delete ret._id;
        delete ret.__v; 
      },
      _id: false,
      id: false
    };
    
    const sharedModelOptions = {
      schemaOptions: {
        toJSON: reshapingOptions,
        toObject: reshapingOptions,
        versionKey: false
      }
    }
    return sharedModelOptions;
}
  
export function setTypegooseGlobalOptions() {
    const reshapingOptions = { 
      transform: function (doc, ret) { 
        delete ret._id;
        delete ret.__v; 
      },
      _id: false,
      id: false
    };
    
    setGlobalOptions({
      schemaOptions: {
        toJSON: reshapingOptions,
        toObject: reshapingOptions,
        versionKey: false,
        strict: true
      },
    });
}