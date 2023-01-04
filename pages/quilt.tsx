import type { NextPage } from 'next';

import { PageContainer } from '@components/common/PageContainer';
import { QuiltImageCreator } from '@components/lightfield/QuiltImageCreator';
import { LightFieldFocusEditor } from '@components/processors/LightFieldFocusEditor';
import { QuiltFramesExtractor } from '@components/processors/QuiltFramesExtractor';

const QuiltPage: NextPage = () => {
  return (
    <PageContainer favicon="🕵️" title="Refocus Quilt Image" subtitle="🕵️ Quilt">
      <QuiltImageCreator processors={[QuiltFramesExtractor, LightFieldFocusEditor]} />
    </PageContainer>
  );
};

export default QuiltPage;
