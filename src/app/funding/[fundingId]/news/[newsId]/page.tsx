import FundingNewsPageBody from '@/components/news/funding_news_page_body';

interface IFundingDetailPageProps {
  params: {
    fundingId: string;
    newsId: string;
  };
}

export default async function FundingNewsPage({ params }: IFundingDetailPageProps) {
  const { fundingId, newsId } = await params;

  return <FundingNewsPageBody fundingId={fundingId} newsId={newsId} />;
}
