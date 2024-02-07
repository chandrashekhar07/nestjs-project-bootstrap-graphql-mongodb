import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateRecipeArgs as CreateRecipeArguments } from '../models/create-recipe.args';
import { FilterRecipesArgs as FilterRecipesArguments } from '../models/filter-recipe.args';
import { Recipe } from '../schemas/recipe.model';
import { RecipeService } from '../services/recipe.service';
import { UpdateRecipeArgs as UpdateRecipeArguments } from '../models/update-recipe.args';

@Resolver(() => Recipe)
export class RecipeResolver {
    constructor(private readonly recipeService: RecipeService) {}

    @Query(() => Recipe)
    async recipe(@Args('id') id: string): Promise<Recipe> {
        return this.recipeService.findOneByIdOrFail(id);
    }

    @Query(() => [Recipe])
    async recipes(@Args() recipesArguments: FilterRecipesArguments): Promise<Recipe[]> {
        return this.recipeService.findAll(recipesArguments);
    }

    @Mutation(() => Recipe)
    async createRecipe(@Args('input') input: CreateRecipeArguments): Promise<Recipe> {
        return this.recipeService.create(input);
    }

    @Mutation(() => Boolean)
    async removeRecipe(@Args('id') id: string): Promise<boolean> {
        const { acknowledged: isAcknowledged } = await this.recipeService.remove(id);

        return !!isAcknowledged;
    }

    @Mutation(() => Recipe)
    async updateRecipe(
        @Args('input') input: UpdateRecipeArguments
    ): Promise<Recipe | null> {
        return this.recipeService.update(input);
    }
}
