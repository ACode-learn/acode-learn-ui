export type ResourceType = 'markdown' | 'code' | 'file' | 'repository' | 'guide';

export interface Resource {
  readonly id: number;
  readonly type: ResourceType;
  readonly title: string;
  readonly description?: string;
}
