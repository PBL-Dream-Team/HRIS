import { getCompanyIdFromToken } from './actions';
import PaymentClient from './client';

export default async function PaymentPage() {
  const company_id = await getCompanyIdFromToken();
  console.log('Company ID:', company_id);

  return <PaymentClient company_id={company_id} />;
}
