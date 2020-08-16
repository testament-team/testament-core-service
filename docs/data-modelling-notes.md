Name, Id, Display Name: 1, 64
Description: 0, 1024
Path: 256

```ts
// Required String:
@ApiProperty()
@prop({ required: true })
@IsString()
@Length(1, 64)

// Optional String:
@ApiProperty()
@prop()
@IsString()
@Length(1, 64)
@IsOptional()

// Required Enum:
@ApiProperty()
@prop({ required: true })
@IsEnum(Type)

// Optional Enum:
@ApiProperty()
@prop()
@IsEnum(Type)
@IsOptional()

// Required Number:
@ApiProperty()
@prop({ required: true })
@IsNumber()
@Min(0)
@Max(1000)

// Optional Number:
@ApiProperty()
@prop()
@IsNumber()
@IsOptional()
@Min(0)
@Max(1000)

// Required Boolean:
@ApiProperty()
@prop({ required: true })
@IsBoolean()

// Optional Boolean:
@ApiProperty()
@prop()
@IsBoolean()
@IsOptional()

// Required Nested Type:
@ApiProperty()
@prop({ required: true })
@ValidateNested()
@Type(() => Type)

// Optional Nested Type:
@ApiProperty()
@prop()
@IsOptional()
@ValidateNested()
@Type(() => Type)
```