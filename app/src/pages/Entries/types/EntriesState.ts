export default interface EntriesState {
  editingEntryId?: string;
  entries: Array<{ id: string; entry: string }>;
}
