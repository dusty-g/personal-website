import dynamic from 'next/dynamic';
import SumOfOddsVisualizer from '../components/SumOfOddsVisualizer';
import ClickCounter from '../components/ClickCounter';

const ExampleButtonHexConfetti = dynamic(
  () => import('../components/ExampleButtonHexConfetti'),
  { ssr: false }
);

const MDXComponents = {
  SumOfOddsVisualizer,
  ExampleButtonHexConfetti,
  ClickCounter,
};

export default MDXComponents;
