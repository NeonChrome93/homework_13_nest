import {Transform} from "class-transformer";
import {TransformFnParams} from "class-transformer/types/interfaces";


export const Trim = () => Transform(({value }: TransformFnParams) => value?.trim() )