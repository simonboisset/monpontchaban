import type { DataFunctionArgs } from '@remix-run/node';
import { mapFormData } from './mapFormData';
import { mapObjectToArrayIfKeysAreNumbers } from './mapObjectToArrayIfKeysAreNumbers';

export const getRequestData = async ({ request, params }: DataFunctionArgs) => {
  let requestData: any = params;
  try {
    const formData = await request.formData();
    const entries = Object.fromEntries(formData) as Record<string, string | undefined>;
    let result: any = {};
    for (const entry in entries) {
      const element = entries[entry];
      if (element) {
        mapFormData(result, entry, element);
      }
    }

    const data = mapObjectToArrayIfKeysAreNumbers(result);
    requestData = { ...requestData, ...result, ...data };
  } catch (error) {}

  return requestData;
};
