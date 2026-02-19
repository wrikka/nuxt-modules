export interface LabelCondition {
  field: 'from' | 'to' | 'subject' | 'body';
  operator: 'contains' | 'not-contains' | 'equals' | 'starts-with' | 'ends-with';
  value: string;
}

export interface Label {
  name: string;
  icon: string;
  conditions?: LabelCondition[];
}
