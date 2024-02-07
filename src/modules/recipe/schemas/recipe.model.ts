import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsString } from 'class-validator';

@InputType({ isAbstract: true })
@ObjectType({ description: 'recipe' })
@Schema()
export class Recipe {
    @Field(() => ID)
    id: string;

    @IsString()
    @Field()
    @Prop()
    title: string;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
