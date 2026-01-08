import {
  IsNumber,
  IsIn,
  IsString,
  IsOptional,
  IsUUID,
  IsDateString,
  Min,
} from 'class-validator';

export class CreateTransactionDto {
  @IsIn(['income', 'expense'])
  type!: 'income' | 'expense';

  @IsNumber()
  @Min(0.01)
  amount!: number;

  @IsDateString()
  date!: string;

  @IsUUID()
  categoryId!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
