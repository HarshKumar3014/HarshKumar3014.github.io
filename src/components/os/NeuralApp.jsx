import NeuralPlayground from './NeuralPlayground';

// neural.app — a bigger sandbox version of the desktop neuron toy.
export default function NeuralApp() {
    return (
        <div className="flex h-full min-h-[320px] flex-col">
            <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
                drag the neurons — connections form under {`<`}175px, signals ride the wires.
            </p>
            <div className="relative mt-3 min-h-0 flex-1 overflow-hidden rounded border border-ice/10 bg-void/50">
                <NeuralPlayground count={11} />
            </div>
        </div>
    );
}
