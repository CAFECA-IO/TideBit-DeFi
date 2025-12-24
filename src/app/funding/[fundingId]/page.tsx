import FundingDetailPageBody from '@/components/funding/funding_detail_page_body';

interface IFundingDetailPageProps {
  params: {
    fundingId: string;
  };
}

export default async function FundingDetailPage({ params }: IFundingDetailPageProps) {
  const { fundingId } = await params;

  return <FundingDetailPageBody fundingId={fundingId} />;
}
