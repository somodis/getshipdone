export class CreateLogDto {
  context?: string;
  message: string;
  level: string;
  userId?: number;
}
export default CreateLogDto;
