import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Settings2, Sparkles, Zap } from 'lucide-react'
import { ReactNode } from 'react'

export function Features() {
    return (
        <section className="py-16 md:py-32">
            <div className="@container mx-auto max-w-5xl px-6">
                <div className="text-center">
                    <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
                        Built for AI-powered automation
                    </h2>
                    <p className="mt-4">
                        Design workflows by combining triggers, apps, and AI into one seamless system.
                    </p>
                </div>

                <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-md gap-10 *:text-center md:mt-16 overflow-visible">
                    
                    <Card className="group border-0 bg-muted shadow-none hover:scale-110 transition-all ease-in-out">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Zap className="size-6" aria-hidden />
                            </CardDecorator>

                            <h3 className="mt-6 font-medium text-primary">Trigger Nodes</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm">
                                Start workflows from events like schedules, webhooks,
                                form submissions, or incoming messages.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="group border-0 bg-muted shadow-none hover:scale-110 transition-all ease-in-out">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Settings2 className="size-6" aria-hidden />
                            </CardDecorator>

                            <h3 className="mt-6 font-medium text-primary">App Integrations</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm">
                                Connect tools like Slack, Discord, Stripe, and Google Forms
                                to move data and actions across your stack.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="group border-0 bg-muted shadow-none hover:scale-110 transition-all ease-in-out">
                        <CardHeader className="pb-3">
                            <CardDecorator>
                                <Sparkles className="size-6" aria-hidden />
                            </CardDecorator>

                            <h3 className="mt-6 font-medium text-primary">AI Models</h3>
                        </CardHeader>

                        <CardContent>
                            <p className="text-sm">
                                Use AI to analyze data, generate content,
                                make decisions, and power intelligent workflows.
                            </p>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </section>
    )
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
    <div aria-hidden className="relative mx-auto size-36 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]">
        <div className="absolute inset-0 [--border:black] dark:[--border:white] bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:24px_24px] opacity-10"/>
        <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-t border-l">{children}</div>
    </div>
)
