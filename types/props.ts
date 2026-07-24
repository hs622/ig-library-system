// Use in server component to fetch properties from a URL.
export default interface PageProps {
  params: Promise<{ bookId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}





export interface UserProps {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}
