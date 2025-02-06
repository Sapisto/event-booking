export interface PageMeta {
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  }
  
  export interface GeneralResponse<T> {
    succeeded: boolean;
    code: number;
    message: string;
    data?: T;
    pageMeta?: PageMeta;
    errors?: string[] | null;
  }

export const calculateTotalPages = (totalRecords: number, pageSize: number): number => {
  return Math.ceil(totalRecords / pageSize);
};
  