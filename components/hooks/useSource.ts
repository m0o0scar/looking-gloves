import { atom, useRecoilState } from 'recoil';

export interface SourceInfo {
  title?: string;
  author?: string;
  url?: string;
  sourceType?: string;
}

const sourceInfoAtom = atom<SourceInfo | undefined>({
  key: 'processors.sourceInfo',
  default: undefined,
});

export const useSource = () => {
  const [sourceInfo, setSourceInfo] = useRecoilState(sourceInfoAtom);

  return { sourceInfo, setSourceInfo };
};
