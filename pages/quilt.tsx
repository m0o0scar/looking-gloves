import type { NextPage } from 'next';
import { useEffect } from 'react';

import { PageContainer } from '@/components/common/PageContainer';
import { LightFieldFocusEditor } from '@/components/processors/LightFieldFocusEditor';
import { QuiltFramesExtractor } from '@/components/processors/QuiltFramesExtractor';
import { initPyScript } from '@/utils/pyscript';
import { registerServiceWorker } from '@/utils/serviceWorker';

const QuiltPage: NextPage = () => {
  useEffect(() => {
    registerServiceWorker('/sw-quilt.js');
    initPyScript();
  }, []);

  return (
    <PageContainer
      favicon="🕵️"
      title="Refocus Quilt Image"
      subtitle="🕵️ Quilt"
      processors={[QuiltFramesExtractor, LightFieldFocusEditor]}
    />
  );
};

export default QuiltPage;
