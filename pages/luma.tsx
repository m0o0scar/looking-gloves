import type { NextPage } from 'next';

import { LumaLightfieldExtractor } from '@components/extractors/LumaLightfieldExtractor';
import { QuiltImageCreator } from '@components/quilt/QuiltImageCreator';

const cols = 8;
const rows = 12;

const LumaPage: NextPage = () => {
  return (
    <article className="prose max-w-full flex flex-col items-center p-5 gap-4 bg-slate-200 min-h-screen box-border">
      <h1>Luma NeRF to Quilt</h1>

      <QuiltImageCreator
        cols={cols}
        rows={rows}
        frameWidth={600}
        sequenceExtractor={({ onProgress, onFramesExtracted }) => (
          <LumaLightfieldExtractor
            numberOfFrames={96}
            onProgress={onProgress}
            onFramesExtracted={onFramesExtracted}
          />
        )}
      />
    </article>
  );
};

export default LumaPage;
