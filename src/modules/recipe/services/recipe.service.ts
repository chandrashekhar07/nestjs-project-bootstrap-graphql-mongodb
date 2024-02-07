import { Injectable } from '@nestjs/common';
import type { CreateRecipeArgs as CreateRecipeArguments } from '../models/create-recipe.args';
import type { FilterRecipesArgs as FilterRecipesArguments } from '../models/filter-recipe.args';
import { Recipe } from '../schemas/recipe.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { UpdateRecipeArgs as UpdateRecipeArguments } from '../models/update-recipe.args';

@Injectable()
export class RecipeService {
    constructor(@InjectModel(Recipe.name) private readonly recipeModel: Model<Recipe>) {}

    async create(data: CreateRecipeArguments): Promise<Recipe> {
        const createdRecipe = new this.recipeModel(data);

        return createdRecipe.save();
    }

    async findOneByIdOrFail(id: string): Promise<Recipe> {
        const recipe = await this.recipeModel.findById(id).exec();

        if (!recipe) {
            throw new Error('Recipe not found');
        }

        return recipe;
    }

    async findAll(recipesArguments: FilterRecipesArguments): Promise<Recipe[]> {
        const { page, size } = recipesArguments;

        return this.recipeModel
            .find()
            .skip(page * size)
            .limit(size)
            .exec();
    }

    async remove(id: string): Promise<{
        acknowledged?: boolean;
    }> {
        return this.recipeModel.deleteOne({ _id: id }).exec();
    }

    async update(data: UpdateRecipeArguments): Promise<Recipe | null> {
        return this.recipeModel.findByIdAndUpdate(data.id, data, { new: true }).exec();
    }
}
