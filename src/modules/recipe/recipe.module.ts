import { Module } from '@nestjs/common';
import { RecipeResolver } from './resolvers/recipe.resolver';
import { RecipeService } from './services/recipe.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Recipe, RecipeSchema } from './schemas';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Recipe.name,
                schema: RecipeSchema
            }
        ])
    ],
    providers: [RecipeResolver, RecipeService]
})
export class RecipeModule {}
