/* eslint-disable no-magic-numbers */
import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';

// Todo: Avoid magic numbers
@ArgsType()
export class FilterRecipesArgs {
    @Field(() => Int)
    @Min(0)
    page = 0;

    @Field(() => Int)
    @Min(1)
    @Max(100)
    size = 10;
}
