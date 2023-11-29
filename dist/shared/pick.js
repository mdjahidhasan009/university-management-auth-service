"use strict";
// const pick = <T extends object, k extends keyof T>(obj: T, keys: k[]): Pick<T, k> => {});
Object.defineProperty(exports, "__esModule", { value: true });
//NOTE: This is a generic function that takes two arguments: an object and an array of keys. The object is of type T, which extends Record<string, unknown> (an object with string keys and unknown values). The keys are of type k, which extends keyof T (a key of T). The function returns an object of type Partial<T> (an object with all properties of T set to optional). The function iterates over the keys array and checks if the object has a property with that key. If it does, it adds that property to the final object and returns it.
const pick = (obj, keys) => {
    const finalObject = {};
    for (const key of keys) {
        if (obj && Object.hasOwnProperty.call(obj, key)) {
            finalObject[key] = obj[key];
        }
    }
    return finalObject;
};
exports.default = pick;
