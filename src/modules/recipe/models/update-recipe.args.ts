import { InputType, PickType } from '@nestjs/graphql';
import { Recipe } from '../schemas';

@InputType()
export class UpdateRecipeArgs extends PickType(Recipe, ['title', 'id'] as const) {}
