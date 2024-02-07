import { InputType, PickType } from '@nestjs/graphql';
import { Recipe } from '../schemas';

@InputType()
export class CreateRecipeArgs extends PickType(Recipe, ['title'] as const) {}
