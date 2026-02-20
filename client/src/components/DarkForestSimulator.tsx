import { useState, useEffect } from 'react';
import { Radio, Target, Brain, Atom, Gavel, MessageCircle, Eye, Sword, Globe, AlertTriangle, Clock, Users, Shield, BookOpen, Zap, Download, ChevronLeft, ChevronRight, SkipBack, SkipForward, Award, FileText, Lightbulb, TrendingUp, MessageSquare, ExternalLink, Settings, Sliders, RefreshCw, Timer, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { GlossaryTerm, GlossaryDialog } from './Glossary';
import DataVisualizations from './DataVisualizations';

// TypeScript interfaces for enhanced features
interface DetailedCaseStudy {
  featured: {
    title: string;
    context: string;
    outcome: string;
    darkForestParallel: string;
    lessons: string[];
    discussionPoints: string[];
    historicalCounterExample?: {
      title: string;
      outcome: string;
      cooperationFactors: string[];
    };
  };
  additionalExamples: {
    title: string;
    summary: string;
    outcome: string;
    cooperationLevel?: 'high' | 'medium' | 'low';
  }[];
}

interface PlayerDecision {
  scenario: number;
  choice: string;
  timestamp: string;
  reasoning?: string;
  confidence?: number;
  timeSpent?: number;
}

interface AssumptionSettings {
  communicationDifficulty: number; // 1-10, affects cooperation weights
  resourceScarcity: number; // 1-10, affects zero-sum thinking
  trustVerification: number; // 1-10, affects caution weights
  technologicalThreat: number; // 1-10, affects aggression weights
}

interface Scenario {
  title: string;
  cosmic: string;
  realWorld: string;
  examples: string[];
  detailedCaseStudy?: DetailedCaseStudy;
  adaptiveFollowUp?: {
    cooperative: string;
    aggressive: string;
    cautious: string;
  };
}

// Case Study Dialog Component
interface CaseStudyDialogProps {
  scenario: Scenario;
  children: React.ReactNode;
}

const CaseStudyDialog = ({ scenario, children }: CaseStudyDialogProps) => {
  if (!scenario.detailedCaseStudy) return <>{children}</>;

  const { featured, additionalExamples } = scenario.detailedCaseStudy;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto" data-testid="dialog-case-studies">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2" data-testid="title-case-studies">
            <FileText className="w-5 h-5" />
            Real-World Case Studies: {scenario.title}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="featured" className="w-full" data-testid="tabs-case-studies">
          <TabsList className="grid w-full grid-cols-3" data-testid="tabs-list-case-studies">
            <TabsTrigger value="featured" data-testid="tab-featured">Featured Case</TabsTrigger>
            <TabsTrigger value="counter-examples" data-testid="tab-counter-examples">Counter-Examples</TabsTrigger>
            <TabsTrigger value="outcome-analysis" data-testid="tab-outcome-analysis">Outcome Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="featured" className="space-y-6 mt-6" data-testid="content-featured">
          {/* Featured Case Study */}
          <div className="border rounded-lg p-6 bg-muted/30" data-testid="section-featured-case-study">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-yellow-600" />
              <h3 className="text-xl font-bold" data-testid="title-featured-case-study">{featured.title}</h3>
            </div>
            
            <div className="grid gap-4">
              <div data-testid="section-context">
                <h4 className="font-semibold text-sm text-muted-foreground mb-2 flex items-center gap-1">
                  <Clock className="w-4 h-4" /> HISTORICAL CONTEXT
                </h4>
                <p className="text-sm" data-testid="text-context">{featured.context}</p>
              </div>
              
              <div data-testid="section-outcome">
                <h4 className="font-semibold text-sm text-muted-foreground mb-2 flex items-center gap-1">
                  <Target className="w-4 h-4" /> OUTCOME
                </h4>
                <p className="text-sm" data-testid="text-outcome">{featured.outcome}</p>
              </div>
              
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4" data-testid="section-dark-forest-parallel">
                <h4 className="font-semibold text-sm text-red-800 dark:text-red-100 mb-2 flex items-center gap-1">
                  <Radio className="w-4 h-4" /> DARK FOREST PARALLEL
                </h4>
                <p className="text-sm text-red-700 dark:text-red-200" data-testid="text-dark-forest-parallel">{featured.darkForestParallel}</p>
              </div>
              
              <div data-testid="section-key-lessons">
                <h4 className="font-semibold text-sm text-muted-foreground mb-2 flex items-center gap-1">
                  <Lightbulb className="w-4 h-4" /> KEY LESSONS
                </h4>
                <ul className="space-y-1" data-testid="list-key-lessons">
                  {featured.lessons.map((lesson, index) => (
                    <li key={index} className="text-sm flex items-start gap-2" data-testid={`lesson-${index}`}>
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      {lesson}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4" data-testid="section-discussion-points">
                <h4 className="font-semibold text-sm text-blue-800 dark:text-blue-100 mb-2 flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" /> DISCUSSION POINTS FOR EDUCATORS
                </h4>
                <ul className="space-y-2" data-testid="list-discussion-points">
                  {featured.discussionPoints.map((point, index) => (
                    <li key={index} className="text-sm text-blue-700 dark:text-blue-200 flex items-start gap-2" data-testid={`discussion-point-${index}`}>
                      <span className="text-blue-500 font-bold mt-0.5">{index + 1}.</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          {/* Additional Examples */}
          {additionalExamples && additionalExamples.length > 0 && (
            <div data-testid="section-additional-examples">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Related Examples
              </h3>
              <div className="grid gap-4">
                {additionalExamples.map((example, index) => (
                  <div key={index} className="border rounded-lg p-4" data-testid={`additional-example-${index}`}>
                    <h4 className="font-semibold mb-2" data-testid={`additional-example-title-${index}`}>{example.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2" data-testid={`additional-example-summary-${index}`}>{example.summary}</p>
                    <div className="bg-muted/50 rounded p-2">
                      <span className="text-xs font-medium text-muted-foreground">Outcome: </span>
                      <span className="text-xs" data-testid={`additional-example-outcome-${index}`}>{example.outcome}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          </TabsContent>
          
          <TabsContent value="counter-examples" className="space-y-6 mt-6" data-testid="content-counter-examples">
            <div className="border rounded-lg p-6 bg-green-50 dark:bg-green-950/30" data-testid="section-counter-examples">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-green-600" />
                <h3 className="text-xl font-bold text-green-800 dark:text-green-100">When Cooperation Succeeded</h3>
              </div>
              {featured.historicalCounterExample ? (
                <div className="space-y-4">
                  <h4 className="font-semibold text-green-700 dark:text-green-200" data-testid="counter-example-title">{featured.historicalCounterExample.title}</h4>
                  <p className="text-sm text-green-600 dark:text-green-300" data-testid="counter-example-outcome">{featured.historicalCounterExample.outcome}</p>
                  <div>
                    <h5 className="font-medium text-green-700 dark:text-green-200 mb-2">Cooperation Factors:</h5>
                    <ul className="space-y-1" data-testid="cooperation-factors">
                      {featured.historicalCounterExample.cooperationFactors.map((factor, index) => (
                        <li key={index} className="text-sm text-green-600 dark:text-green-300 flex items-start gap-2" data-testid={`cooperation-factor-${index}`}>
                          <span className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-green-600 dark:text-green-300 italic">Counter-examples will be added as case studies are expanded.</p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="outcome-analysis" className="space-y-6 mt-6" data-testid="content-outcome-analysis">
            <div className="border rounded-lg p-6 bg-blue-50 dark:bg-blue-950/30" data-testid="section-outcome-analysis">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="text-xl font-bold text-blue-800 dark:text-blue-100">Outcome Analysis</h3>
              </div>
              
              <div className="grid gap-4">
                <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-100 mb-2 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" /> Risk Assessment
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-200">Dark Forest assumptions led to {featured.outcome.includes('debate') || featured.outcome.includes('discussion') ? 'ongoing policy debates' : 'significant policy changes'}.</p>
                </div>
                
                <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 dark:text-green-100 mb-2 flex items-center gap-1">
                    <Shield className="w-4 h-4" /> Alternative Approaches
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-200">Cooperative frameworks {featured.historicalCounterExample ? 'have shown success' : 'offer potential alternatives'} in similar situations.</p>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 dark:text-purple-100 mb-2 flex items-center gap-1">
                    <Brain className="w-4 h-4" /> Key Insights
                  </h4>
                  <ul className="space-y-1" data-testid="key-insights">
                    {featured.lessons.slice(0, 2).map((lesson, index) => (
                      <li key={index} className="text-sm text-purple-700 dark:text-purple-200 flex items-start gap-2" data-testid={`insight-${index}`}>
                        <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                        {lesson}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

// Reasoning Capture Dialog Component
const ReasoningDialog = ({ isOpen, onClose, onSubmit, choiceLabel, initialReasoning = '', initialConfidence = 5 }: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reasoning: string, confidence: number) => void;
  choiceLabel: string;
  initialReasoning?: string;
  initialConfidence?: number;
}) => {
  const [reasoning, setReasoning] = useState(initialReasoning);
  const [confidence, setConfidence] = useState(initialConfidence);

  const handleSubmit = () => {
    onSubmit(reasoning, confidence);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]" data-testid="dialog-reasoning">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Decision Analysis
          </DialogTitle>
          <DialogDescription>
            You chose: <strong>{choiceLabel}</strong><br />
            Please share your reasoning and confidence level.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="reasoning" className="text-sm font-medium mb-2 block">
              Reasoning (Optional)
            </label>
            <Textarea
              id="reasoning"
              placeholder="Why did you choose this option? What factors influenced your decision?"
              value={reasoning}
              onChange={(e) => setReasoning(e.target.value)}
              className="min-h-[100px]"
              data-testid="textarea-reasoning"
            />
          </div>
          
          <div>
            <label htmlFor="confidence" className="text-sm font-medium mb-2 block">
              Confidence Level: {confidence}/10
            </label>
            <Slider
              id="confidence"
              min={1}
              max={10}
              step={1}
              value={[confidence]}
              onValueChange={(value) => setConfidence(value[0])}
              className="w-full"
              data-testid="slider-confidence"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Not confident</span>
              <span>Very confident</span>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} data-testid="button-skip-reasoning">
            Skip
          </Button>
          <Button onClick={handleSubmit} data-testid="button-submit-reasoning">
            Confirm Decision
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Assumption Testing Laboratory Component
const AssumptionLab = ({ assumptions, onAssumptionsChange, onReset }: {
  assumptions: AssumptionSettings;
  onAssumptionsChange: (assumptions: AssumptionSettings) => void;
  onReset: () => void;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2" data-testid="button-assumption-lab">
          <Sliders className="w-4 h-4" />
          Assumption Laboratory
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Test Dark Forest Assumptions
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Adjust the core assumptions of Dark Forest theory to see how optimal strategies change.
          </p>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Communication Difficulty</label>
                <span className="text-sm text-muted-foreground" data-testid="value-communication">{assumptions.communicationDifficulty}/10</span>
              </div>
              <Slider
                value={[assumptions.communicationDifficulty]}
                onValueChange={([value]) => onAssumptionsChange({
                  ...assumptions,
                  communicationDifficulty: value
                })}
                max={10}
                min={1}
                step={1}
                className="w-full"
                data-testid="slider-communication"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Higher values make communication riskier, favoring silence/aggression
              </p>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Resource Scarcity</label>
                <span className="text-sm text-muted-foreground" data-testid="value-scarcity">{assumptions.resourceScarcity}/10</span>
              </div>
              <Slider
                value={[assumptions.resourceScarcity]}
                onValueChange={([value]) => onAssumptionsChange({
                  ...assumptions,
                  resourceScarcity: value
                })}
                max={10}
                min={1}
                step={1}
                className="w-full"
                data-testid="slider-scarcity"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Higher scarcity increases zero-sum thinking and competition
              </p>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Trust Verification Difficulty</label>
                <span className="text-sm text-muted-foreground" data-testid="value-trust">{assumptions.trustVerification}/10</span>
              </div>
              <Slider
                value={[assumptions.trustVerification]}
                onValueChange={([value]) => onAssumptionsChange({
                  ...assumptions,
                  trustVerification: value
                })}
                max={10}
                min={1}
                step={1}
                className="w-full"
                data-testid="slider-trust"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Higher difficulty increases caution and information gathering
              </p>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Technological Threat Level</label>
                <span className="text-sm text-muted-foreground" data-testid="value-threat">{assumptions.technologicalThreat}/10</span>
              </div>
              <Slider
                value={[assumptions.technologicalThreat]}
                onValueChange={([value]) => onAssumptionsChange({
                  ...assumptions,
                  technologicalThreat: value
                })}
                max={10}
                min={1}
                step={1}
                className="w-full"
                data-testid="slider-threat"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Higher threat levels favor preemptive action
              </p>
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={onReset} data-testid="button-reset-assumptions">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset to Defaults
            </Button>
            <DialogTrigger asChild>
              <Button data-testid="button-apply-assumptions">Apply Changes</Button>
            </DialogTrigger>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DarkForestSimulator = () => {
  const [currentStep, setCurrentStep] = useState('intro');
  const [currentScenario, setCurrentScenario] = useState(0);
  const [educationContext, setEducationContext] = useState('business');
  const [playerDecisions, setPlayerDecisions] = useState<PlayerDecision[]>([]);
  const [scores, setScores] = useState({
    cooperation: 0,
    caution: 0,
    aggression: 0
  });
  const [selectedChoice, setSelectedChoice] = useState('');
  const [showConsequence, setShowConsequence] = useState(false);
  const [showCriticisms, setShowCriticisms] = useState(false);
  const [keyboardNavigationEnabled, setKeyboardNavigationEnabled] = useState(false);
  const [focusedChoiceIndex, setFocusedChoiceIndex] = useState(0);
  
  // Enhanced state for assumption testing and reasoning
  const [currentReasoning, setCurrentReasoning] = useState('');
  const [currentConfidence, setCurrentConfidence] = useState(5);
  const [showReasoningDialog, setShowReasoningDialog] = useState(false);
  const [decisionStartTime, setDecisionStartTime] = useState(Date.now());
  const [assumptions, setAssumptions] = useState<AssumptionSettings>({
    communicationDifficulty: 7,
    resourceScarcity: 6,
    trustVerification: 8,
    technologicalThreat: 5
  });

  // --- Data Definitions ---
  const contexts = {
    business: {
      name: "Business Strategy",
      icon: Target,
      color: "blue",
      description: "Strategic decision-making, competitive intelligence, market dynamics"
    },
    philosophy: {
      name: "Philosophy & Ethics",
      icon: Brain,
      color: "purple",
      description: "Moral reasoning, ethics of preemption, intergenerational responsibility"
    },
    science: {
      name: "Science & SETI",
      icon: Atom,
      color: "green",
      description: "Research ethics, knowledge sharing, scientific collaboration vs. security"
    },
    policy: {
      name: "Policy & Governance",
      icon: Gavel,
      color: "red",
      description: "International relations, collective action, crisis governance"
    }
  };

  const scenarios = {
    business: [
      {
        title: "STEALTH COMPETITOR INTELLIGENCE",
        cosmic: "Deep space monitoring detects encrypted signals from advanced civilization.",
        realWorld: "Corporate intelligence discovers competitor's secret R&D program targeting your market.",
        examples: ["Apple vs. Samsung patent wars", "Uber vs. traditional taxi disruption", "Netflix vs. Blockbuster streaming pivot"],
        detailedCaseStudy: {
          featured: {
            title: "Kodak vs. Digital Photography Revolution (1975-2012)",
            context: "In 1975, Kodak engineer Steven Sasson invented the first digital camera. Despite this breakthrough, Kodak executives decided to suppress the technology to protect their film business.",
            outcome: "Kodak filed for bankruptcy in 2012 while competitors like Canon and Sony dominated the digital market. The company that invented digital photography became its most famous victim.",
            darkForestParallel: "Like a civilization discovering another's advanced technology but choosing silence over adaptation, Kodak had intelligence about the future but failed to act decisively.",
            lessons: [
              "First-mover advantage can be squandered by institutional inertia",
              "Protecting existing revenue streams can blind organizations to existential threats",
              "Strategic intelligence is worthless without willingness to adapt"
            ],
            discussionPoints: [
              "Was Kodak's decision rational given their market position in 1975?",
              "How might Dark Forest theory apply to corporate disruption scenarios?",
              "What early warning systems could organizations implement?"
            ],
            historicalCounterExample: {
              title: "Sony-Philips CD Development Partnership (1979-1982)",
              outcome: "Despite being competitors in consumer electronics, Sony and Philips cooperated to create the Compact Disc standard, creating a multi-billion dollar market that benefited both companies and consumers worldwide.",
              cooperationFactors: [
                "Shared recognition that collaboration would benefit both parties",
                "Technical expertise complementarity (Sony's manufacturing, Philips' optical research)",
                "Industry-wide standard creation needed collective legitimacy",
                "Long-term market creation valued over short-term competitive advantage"
              ]
            }
          },
          additionalExamples: [
            {
              title: "Blockbuster vs. Netflix (1997-2010)",
              summary: "Blockbuster rejected Netflix's partnership offer in 2000, viewing streaming as a niche market. Netflix's patient strategy eventually destroyed the video rental giant.",
              outcome: "Blockbuster closed 9,000 stores; Netflix reached 200M+ subscribers worldwide."
            },
            {
              title: "BlackBerry vs. iPhone Disruption (2007-2016)",
              summary: "BlackBerry dismissed touchscreen phones as toys, focusing on enterprise security while Apple redefined the smartphone market.",
              outcome: "BlackBerry's market share fell from 50% to under 1% in less than a decade."
            }
          ]
        },
        adaptiveFollowUp: {
          cooperative: "Your decision to pursue communication aligns with believing competitors can be partners. This opens possibilities for strategic alliances, joint ventures, or industry-wide standards that benefit all players.",
          aggressive: "Your aggressive response reflects Dark Forest thinking - striking first before threats materialize. This approach may secure short-term advantages but could escalate competitive dynamics.",
          cautious: "Your cautious approach demonstrates strategic wisdom. By gathering more intelligence before acting, you balance immediate threats with long-term relationship management."
        }
      },
      {
        title: "MARKET EXPANSION CONFLICT",
        cosmic: "Multiple species colonizing same resource-rich star system.",
        realWorld: "Several major players entering same emerging market with limited capacity.",
        examples: ["Streaming wars (Disney+, Netflix, Amazon)", "Cloud computing dominance (AWS, Azure, GCP)", "Electric vehicle market (Tesla, GM, Ford)"],
        detailedCaseStudy: {
          featured: {
            title: "The Browser Wars: Netscape vs. Microsoft (1994-2001)",
            context: "In 1994, Netscape Navigator dominated web browsing with 90% market share. Microsoft responded by bundling Internet Explorer with Windows, leveraging their OS monopoly.",
            outcome: "By 2001, Internet Explorer captured 95% market share. Netscape was acquired by AOL and essentially disappeared from the consumer market.",
            darkForestParallel: "Microsoft used a 'first strike' strategy, leveraging existing dominance in one domain (OS) to eliminate competition in another (browsers), demonstrating aggressive resource deployment.",
            lessons: [
              "Platform leverage can overwhelm pure innovation",
              "Market timing and distribution matter more than technical superiority",
              "Regulatory responses often lag behind competitive realities"
            ],
            discussionPoints: [
              "Was Microsoft's strategy ethical or simply effective business?",
              "How do network effects create winner-take-all dynamics?",
              "When should governments intervene in market competition?"
            ],
            historicalCounterExample: {
              title: "Internet Development Through Open Standards (1969-1991)",
              outcome: "Despite commercial and military interests, key internet protocols (TCP/IP, HTTP, HTML) were developed through open collaboration between universities, government agencies, and eventually private companies, creating the foundation for global connectivity.",
              cooperationFactors: [
                "Academic research culture valued open knowledge sharing",
                "Government funding (DARPA) encouraged non-proprietary standards",
                "Network effects required interoperability for success",
                "Long-term vision of universal connectivity outweighed short-term control"
              ]
            }
          },
          additionalExamples: [
            {
              title: "Video Game Console Wars (Nintendo, Sony, Microsoft)",
              summary: "Each generation sees massive investment in exclusive content and technological differentiation, with only 2-3 viable competitors worldwide.",
              outcome: "Winner-take-all dynamics with losing platforms often exiting the market entirely."
            },
            {
              title: "Ride-Sharing Market Consolidation (Uber vs. Lyft vs. Local)",
              summary: "Global expansion required massive capital investment and regulatory capture, leading to oligopoly formation.",
              outcome: "Market consolidated to 1-2 dominant players per region despite initial diversity."
            }
          ]
        },
        adaptiveFollowUp: {
          cooperative: "Your communication approach suggests belief in market-sharing possibilities. This could lead to strategic partnerships, joint ventures, or collaborative market development instead of zero-sum competition.",
          aggressive: "Your aggressive approach reflects winner-take-all market thinking. This rapid expansion strategy may capture market share but could trigger expensive competitive wars.",
          cautious: "Your cautious strategy shows wisdom in market expansion timing. Observing competitors before committing resources helps avoid costly overextension and timing mistakes."
        }
      },
      {
        title: "STRATEGIC ALLIANCE DILEMMA",
        cosmic: "Powerful alien federation offers technology sharing but demands submission.",
        realWorld: "Tech giant offers partnership but could eventually acquire or marginalize you.",
        examples: ["Facebook acquiring Instagram/WhatsApp", "Google's Android partnerships", "Microsoft's embrace-extend-extinguish strategy"],
        detailedCaseStudy: {
          featured: {
            title: "Instagram's $1 Billion Acquisition by Facebook (2012)",
            context: "Instagram, a 13-person startup, had built a photo-sharing app that was growing faster than Facebook itself. Facebook offered $1 billion - 1% of their market cap - for the two-year-old company.",
            outcome: "Instagram became one of Facebook's most valuable assets, now worth over $100 billion. Founders Kevin Systrom and Mike Krieger eventually left, citing creative differences.",
            darkForestParallel: "Like a smaller civilization accepting protection from a galactic empire, Instagram gained resources but lost autonomy. The 'protection' came with complete absorption.",
            lessons: [
              "Acquisition offers can be both opportunity and existential threat",
              "Market leaders use acquisitions to eliminate future competition",
              "Financial success doesn't guarantee creative or strategic independence"
            ],
            discussionPoints: [
              "Should antitrust laws prevent such acquisitions?",
              "How can smaller companies maintain independence while scaling?",
              "When is cooperation actually surrender in disguise?"
            ]
          },
          additionalExamples: [
            {
              title: "WhatsApp Acquisition for $19 Billion (2014)",
              summary: "Facebook acquired WhatsApp to prevent Google from getting it, despite WhatsApp's founders' opposition to advertising models.",
              outcome: "WhatsApp's ad-free model was eventually compromised; founders left with massive payouts."
            },
            {
              title: "Microsoft's Java Strategy vs. Sun Microsystems",
              summary: "Microsoft embraced Java, extended it with Windows-specific features, then attempted to fragment the standard to favor their platform.",
              outcome: "Legal battles ensued; Java remained independent but Microsoft's strategy delayed adoption."
            }
          ]
        },
        adaptiveFollowUp: {
          cooperative: "Your communication approach suggests faith in genuine partnership possibilities. This opens doors for strategic alliances while maintaining independence, sharing resources without surrendering control.",
          aggressive: "Your aggressive response prioritizes independence over partnership benefits. This approach may preserve autonomy but could forfeit valuable resources and strategic advantages.",
          cautious: "Your cautious evaluation of the partnership shows strategic wisdom. Careful analysis of terms, motivations, and exit strategies helps distinguish genuine cooperation from acquisition attempts."
        }
      },
      {
        title: "INFORMATION WARFARE",
        cosmic: "Intercepted alien communications reveal plans to manipulate human behavior.",
        realWorld: "Discovery of competitor using misinformation to damage your brand reputation.",
        examples: ["Social media manipulation campaigns", "Corporate espionage cases", "Astroturfing and fake review attacks"],
        detailedCaseStudy: {
          featured: {
            title: "Cambridge Analytica and Facebook Data Manipulation (2013-2018)",
            context: "Cambridge Analytica harvested personal data from 87 million Facebook users without consent, using it to build psychological profiles for political advertising during the 2016 US election and Brexit referendum.",
            outcome: "Cambridge Analytica shut down amid investigations. Facebook faced $5 billion in fines and massive reputation damage. Political manipulation through social media became a global concern.",
            darkForestParallel: "Like aliens using intercepted communications to manipulate human behavior, Cambridge Analytica used personal data as intelligence to influence mass behavior without detection.",
            lessons: [
              "Personal data can be weaponized for behavioral manipulation",
              "Platform owners may be unaware of how their systems are being exploited",
              "Information warfare can undermine democratic processes"
            ],
            discussionPoints: [
              "How should platforms balance openness with preventing manipulation?",
              "What constitutes 'informed consent' in the digital age?",
              "How can societies defend against information warfare while preserving free speech?"
            ]
          },
          additionalExamples: [
            {
              title: "Corporate Astroturfing Campaigns",
              summary: "Companies create fake grassroots movements to influence public opinion, like energy companies funding climate denial groups.",
              outcome: "When exposed, these campaigns often backfire spectacularly and damage corporate credibility."
            },
            {
              title: "Competitor Intelligence Through Social Engineering",
              summary: "Industrial espionage using social media and employee manipulation to extract trade secrets and strategic plans.",
              outcome: "Billions in losses annually, leading to increased corporate cybersecurity and employee training."
            }
          ]
        },
        adaptiveFollowUp: {
          cooperative: "Your communication approach suggests belief in transparency and authentic engagement. This opens possibilities for collaborative fact-checking, industry standards for information integrity, and cooperative defense against misinformation.",
          aggressive: "Your aggressive response treats information warfare as requiring immediate counter-attack. This approach may effectively neutralize threats but could escalate conflicts and damage broader stakeholder relationships.",
          cautious: "Your cautious approach recognizes the complexity of information warfare. Careful investigation, evidence gathering, and measured responses help distinguish between legitimate criticism and coordinated attacks."
        }
      }
    ],
    philosophy: [
      {
        title: "INTERGENERATIONAL CONSENT",
        cosmic: "Current generation making contact decisions binding all future humans.",
        realWorld: "Present actions on climate change determining habitability for centuries.",
        examples: ["Nuclear waste storage decisions", "Genetic engineering of human embryos", "AI development without safety controls"],
        detailedCaseStudy: {
          featured: {
            title: "Nuclear Waste Storage and Intergenerational Ethics (1950s-Present)",
            context: "Nuclear power generation creates radioactive waste that remains dangerous for thousands of years. Current generations make disposal decisions that will impact hundreds of future generations who had no voice in the choice.",
            outcome: "Various countries have struggled with long-term storage solutions. Finland's Onkalo facility represents a 100,000-year commitment. Many proposed sites have faced opposition, leaving temporary storage as the default for decades.",
            darkForestParallel: "Like alien contact decisions, nuclear waste choices bind all future humans to consequences they cannot escape. The present generation acts as humanity's representative in a decision with cosmic timescales.",
            lessons: [
              "Present decisions can create irreversible commitments for future generations",
              "Democratic consent becomes problematic across time horizons",
              "Technological choices carry moral weight beyond immediate consequences"
            ],
            discussionPoints: [
              "Do current generations have the right to make irreversible decisions for the future?",
              "How should we weigh present benefits against future risks?",
              "What moral obligations do we have to people not yet born?"
            ]
          },
          additionalExamples: [
            {
              title: "CRISPR Gene Editing in Human Embryos",
              summary: "Genetic modifications made to embryos become heritable, potentially affecting the entire human gene pool permanently without future consent.",
              outcome: "Scientific moratoriums declared while ethical frameworks develop, but enforcement remains challenging globally."
            },
            {
              title: "AI Development Without Safety Controls",
              summary: "Rapid advancement in artificial intelligence creates potentially irreversible changes to human civilization and future development paths.",
              outcome: "Growing calls for AI safety research and international coordination, but competitive pressures continue to drive rapid deployment."
            }
          ]
        }
      },
      {
        title: "UTILITARIAN CALCULUS AT SCALE",
        cosmic: "Eliminating potentially peaceful aliens to prevent hypothetical human extinction.",
        realWorld: "Harming innocent individuals to prevent greater collective catastrophe.",
        examples: ["Wartime civilian bombing to end conflicts", "Quarantine measures during pandemics", "Surveillance programs to prevent terrorism"]
      },
      {
        title: "DEONTOLOGICAL DUTIES VS CONSEQUENCES",
        cosmic: "Moral obligation to communicate truthfully vs. strategic deception for survival.",
        realWorld: "Duty to tell truth vs. lying to protect people from harmful information.",
        examples: ["Whistleblowing on government misconduct", "Medical professionals withholding terminal diagnoses", "Parents lying to protect children's innocence"]
      },
      {
        title: "MORAL STATUS OF THE OTHER",
        cosmic: "Do alien civilizations deserve same moral consideration as humans?",
        realWorld: "How do we weigh rights of different groups in moral decision-making?",
        examples: ["Animal rights vs. human medical research", "Indigenous rights vs. economic development", "AI rights as systems become more sophisticated"]
      }
    ],
    science: [
      {
        title: "DUAL-USE RESEARCH ETHICS",
        cosmic: "Studying alien biotechnology could cure diseases or create bioweapons.",
        realWorld: "Research advancing beneficial knowledge while enabling dangerous applications.",
        examples: ["Gain-of-function virus research", "CRISPR gene editing capabilities", "AI research with military applications"],
        detailedCaseStudy: {
          featured: {
            title: "Gain-of-Function Virus Research and Pandemic Risk (2011-Present)",
            context: "Scientists enhance viruses to study pandemic potential, including H5N1 bird flu modifications that increased transmissibility. Research aims to anticipate threats but creates risks of laboratory accidents or bioweapon development.",
            outcome: "Research sparked global debate, leading to funding moratoriums (2014-2017), enhanced safety protocols, and ongoing ethical controversies. The COVID-19 pandemic intensified debates about laboratory safety and dual-use research oversight.",
            darkForestParallel: "Like studying alien technology, gain-of-function research offers benefits (pandemic preparedness) but creates existential risks (enhanced pathogens). The knowledge gained could protect or destroy humanity.",
            lessons: [
              "Scientific knowledge inherently carries dual-use potential",
              "Safety protocols can reduce but never eliminate risks",
              "Global coordination is essential for dual-use research governance"
            ],
            discussionPoints: [
              "How should society balance scientific advancement against potential catastrophic risks?",
              "Who should decide which research is too dangerous to pursue?",
              "Can democratic processes adequately govern highly technical dual-use research?"
            ],
            historicalCounterExample: {
              title: "International Atomic Energy Agency (IAEA) Formation (1957-Present)",
              outcome: "Despite nuclear technology's dual-use potential for energy and weapons, 168 nations cooperated to create oversight systems for peaceful nuclear development, preventing widespread nuclear proliferation for over 60 years.",
              cooperationFactors: [
                "Mutual vulnerability created shared interest in non-proliferation",
                "Technical expertise sharing reduced dangerous experimentation",
                "Verification protocols built trust through transparency",
                "Eisenhower's 'Atoms for Peace' provided cooperative framework"
              ]
            }
          },
          additionalExamples: [
            {
              title: "CRISPR Military Applications",
              summary: "Gene editing technology developed for medical applications can potentially be weaponized for biological warfare or human enhancement programs.",
              outcome: "International calls for governance frameworks, but enforcement remains challenging across national boundaries."
            },
            {
              title: "AI Research and Autonomous Weapons",
              summary: "Artificial intelligence advances for civilian applications directly enable lethal autonomous weapons systems and surveillance capabilities.",
              outcome: "UN discussions on autonomous weapons bans, but major powers continue military AI development programs."
            }
          ]
        }
      },
      {
        title: "OPEN SCIENCE VS SECURITY",
        cosmic: "Publishing first contact protocols advances science but reveals vulnerabilities.",
        realWorld: "Academic publication helps progress but provides dangerous blueprints.",
        examples: ["Computer security vulnerability disclosure", "Nuclear physics research publication", "Synthetic biology methodology sharing"]
      },
      {
        title: "PEER REVIEW UNDER PRESSURE",
        cosmic: "Political leaders pressuring scientists to classify alien threat assessments.",
        realWorld: "Government influence on scientific conclusions about public safety.",
        examples: ["COVID-19 origin investigations", "Climate change research funding", "Tobacco industry industry influence on health studies"]
      },
      {
        title: "RESEARCH COLLABORATION RISKS",
        cosmic: "Joint human-alien research could accelerate discovery or enable infiltration.",
        realWorld: "International scientific collaboration vs. intellectual property theft.",
        examples: ["China-US research partnerships scrutiny", "European vs. American tech collaboration", "Academic espionage concerns"]
      }
    ],
    policy: [
      {
        title: "COLLECTIVE ACTION FAILURE",
        cosmic: "Earth nations compete for alien favor while unified response would benefit all.",
        realWorld: "Countries prioritizing national interests over global coordination.",
        examples: ["Climate change negotiations", "COVID-19 vaccine distribution", "Space debris cleanup efforts"],
        detailedCaseStudy: {
          featured: {
            title: "COVID-19 Vaccine Nationalism and Global Coordination Failure (2020-2022)",
            context: "Despite COVID-19 being a global threat requiring coordinated response, wealthy nations secured vaccine supplies far exceeding their needs while blocking technology transfers and limiting global production, leaving billions unvaccinated.",
            outcome: "Vaccine inequity prolonged the pandemic, allowed new variants to emerge, and cost trillions in economic damage. Despite initial pledges of global cooperation, nationalism ultimately prevailed over collective action.",
            darkForestParallel: "Like nations competing for alien technology instead of unifying, countries prioritized national vaccine security over global pandemic response, ultimately making everyone less safe through prolonged viral circulation.",
            lessons: [
              "National interests often override collective benefits even in global crises",
              "Early coordination mechanisms may collapse under pressure",
              "Inequality in crisis response undermines overall effectiveness"
            ],
            discussionPoints: [
              "When should national sovereignty yield to global collective action?",
              "How can international institutions maintain cooperation during crises?",
              "What mechanisms could prevent 'every nation for itself' responses to global threats?"
            ],
            historicalCounterExample: {
              title: "Global Polio Eradication Initiative (1988-Present)",
              outcome: "Despite political tensions and resource competition, over 200 countries cooperated to reduce polio cases by 99.9%, demonstrating successful global health coordination through WHO, UNICEF, and Rotary International partnerships.",
              cooperationFactors: [
                "Shared humanitarian goal transcended political differences",
                "Technical expertise and vaccine sharing across borders",
                "Long-term commitment with measurable progress tracking",
                "Civil society organizations bridged government gaps"
              ]
            }
          },
          additionalExamples: [
            {
              title: "Climate Change Negotiations and National Interests",
              summary: "Despite climate change being a global threat, nations prioritize short-term economic interests over coordinated emissions reductions.",
              outcome: "Repeated failures to meet climate targets, with developing and developed nations blaming each other while global temperatures continue rising."
            },
            {
              title: "Space Debris Cleanup Coordination",
              summary: "Space debris threatens all satellite operations, but cleanup efforts require international coordination and cost-sharing that nations resist.",
              outcome: "Debris continues accumulating, threatening the 'commons' of orbital space while nations focus on their own satellite capabilities."
            }
          ]
        }
      },
      {
        title: "SECURITY DILEMMA ESCALATION",
        cosmic: "Building space defenses against aliens triggers human arms race.",
        realWorld: "Defensive measures perceived as offensive threats by neighbors.",
        examples: ["NATO expansion and Russian responses", "Missile defense systems triggering buildup", "Cyber warfare capabilities development"]
      },
      {
        title: "DEMOCRATIC LEGITIMACY IN CRISIS",
        cosmic: "Alien threat requires rapid decisions bypassing democratic deliberation.",
        realWorld: "Emergencies creating pressure for authoritarian decision-making.",
        examples: ["Pandemic emergency powers", "Post-9/11 surveillance expansion", "War powers and congressional oversight"]
      },
      {
        title: "INTERNATIONAL LAW EVOLUTION",
        cosmic: "No legal framework exists for interspecies relations and conflicts.",
        realWorld: "New technologies and threats outpacing existing legal structures.",
        examples: ["Cyber warfare legal frameworks", "Space law for commercial activities", "AI governance and liability"]
      }
    ]
  };

  const darkForestChoices = [
    {
      id: 'communicate',
      label: 'COMMUNICATE',
      icon: MessageCircle,
      color: 'green',
      risk: 'High',
      theory: "Announce your presence and attempt peaceful contact",
      darkForestView: "Extremely dangerous - reveals location and capabilities to potential threats",
      alternatives: ["Could enable cooperation and mutual benefit", "Builds trust and shared knowledge", "Creates opportunities for peaceful coexistence"],
      gameTheoryNote: "Cooperative strategy that maximizes mutual benefit but exposes vulnerability"
    },
    {
      id: 'silence',
      label: 'MAINTAIN SILENCE',
      icon: Eye,
      color: 'yellow',
      risk: 'Medium',
      theory: "Remain hidden while gathering intelligence about others",
      darkForestView: "Safest option - preserves anonymity while monitoring threats",
      alternatives: ["May miss opportunities for beneficial contact", "Others might interpret silence as hostility", "Could lead to mutual isolation"],
      gameTheoryNote: "Cautious strategy using information asymmetry and risk assessment"
    },
    {
      id: 'escalate',
      label: 'PREEMPTIVE STRIKE',
      icon: Sword,
      color: 'red',
      risk: 'Extreme',
      theory: "Eliminate potential threats before they can threaten you",
      darkForestView: "Rational if survival is paramount - better safe than extinct",
      alternatives: ["Could destroy peaceful civilizations unnecessarily", "Reveals aggressive capabilities to other observers", "May trigger retaliatory responses"]
    }
  ];

  const consequences = {
    communicate: {
      darkForest: "You've revealed Earth's location and technological level. Any hostile civilizations now know exactly where to find you and how advanced you are. Peaceful civilizations may respond positively, but aggressive ones will see an opportunity.",
      alternative: "Open communication establishes trust and enables cooperation. While there are risks, transparency creates opportunities for mutual benefit and collaborative problem-solving that isolation cannot provide.",
      outcome: "Maximum transparency, high vulnerability, potential for cooperation or conflict"
    },
    silence: {
      darkForest: "You remain safely hidden, but other civilizations continue developing unknown capabilities. Your technological gap with potential threats may be growing while you observe passively. Others may interpret your silence as preparation for attack.",
      alternative: "Strategic patience allows careful assessment without premature commitment. However, excessive caution may cause you to miss beneficial opportunities and could be misinterpreted as hostile preparation by others.",
      outcome: "Preserved anonymity but unknown threat levels continue developing"
    },
    escalate: {
      darkForest: "Preemptive strike succeeds in eliminating a potential threat, but reveals your aggressive capabilities and willingness to attack first. Any other civilizations monitoring will now view you as the primary threat to eliminate.",
      alternative: "Aggressive action may have destroyed a peaceful civilization and establishes you as the aggressor. This could trigger defensive alliances against Earth or retaliatory strikes from the victim's allies.",
      outcome: "Immediate threat eliminated but reputation as primary aggressor established"
    }
  };

  const criticisms = {
    logical: [
      "Assumes all civilizations share identical risk assessment and strategic thinking",
      "Ignores potential for alliance formation and mutual defense agreements",
      "Overestimates ease of successful interstellar warfare and genocide",
      "Fails to account for resource abundance through technological advancement"
    ],
    empirical: [
      "No evidence of galactic-scale warfare or civilization debris",
      "Observable universe shows no signs of mega-scale conflicts",
      "Lacks testable predictions about cosmic behavior patterns",
      "Alternative explanations for Fermi Paradox remain equally viable"
    ],
    ethical: [
      "Promotes paranoid thinking that could become self-fulfilling prophecy",
      "Justifies preemptive violence based on hypothetical threats",
      "Ignores moral obligations to attempt peaceful contact first",
      "Could lead to unnecessary isolation and missed opportunities"
    ]
  };

  const disciplineCriticisms = {
    business: {
      flaws: "Business shows cooperation often outperforms competition - platforms, ecosystems, and partnerships create more value than zero-sum rivalry",
      examples: ["Open source software success", "Platform ecosystem strategies", "Supply chain partnerships", "Industry standards collaboration"]
    },
    philosophy: {
      flaws: "Violates core ethical principles by justifying violence based on speculation rather than evidence, ignoring duties to attempt peaceful resolution",
      examples: ["Just war theory requiring last resort", "Kantian categorical imperative", "Rawlsian veil of ignorance", "Ubuntu philosophy of interconnectedness"]
    },
    science: {
      flaws: "Contradicts scientific method by making unfalsifiable claims and ignoring empirical evidence of cooperation in biological evolution",
      examples: ["Symbiosis in evolutionary biology", "Scientific collaboration successes", "Open science accelerating discovery", "International research cooperation"]
    },
    policy: {
      flaws: "International relations theory shows institutions and norms can overcome security dilemmas through transparency and verification mechanisms",
      examples: ["Arms control treaties success", "International trade cooperation", "UN peacekeeping effectiveness", "Environmental cooperation agreements"]
    }
  };
  
  const contextChoiceWeights = {
    business: {
      communicate: { cooperation: 1.5, caution: 0.5, aggression: 0.2 },
      silence: { cooperation: 0.8, caution: 1.5, aggression: 0.4 },
      escalate: { cooperation: 0.1, caution: 0.3, aggression: 2.5 }
    },
    philosophy: {
      communicate: { cooperation: 2.0, caution: 0.8, aggression: 0.1 },
      silence: { cooperation: 1.0, caution: 1.5, aggression: 0.2 },
      escalate: { cooperation: 0.2, caution: 0.5, aggression: 1.8 }
    },
    science: {
      communicate: { cooperation: 1.8, caution: 1.0, aggression: 0.3 },
      silence: { cooperation: 1.2, caution: 1.8, aggression: 0.5 },
      escalate: { cooperation: 0.2, caution: 0.4, aggression: 1.5 }
    },
    policy: {
      communicate: { cooperation: 1.6, caution: 1.0, aggression: 0.4 },
      silence: { cooperation: 1.0, caution: 1.5, aggression: 0.6 },
      escalate: { cooperation: 0.5, caution: 0.5, aggression: 2.2 }
    }
  };

  // --- Core Logic Functions ---

  // Determine adaptive follow-up based on player's dominant tendency
  const getAdaptiveFollowUp = () => {
    const { cooperation, caution, aggression } = scores;
    const currentData = scenarios[educationContext as keyof typeof scenarios][currentScenario];
    
    if (!currentData.adaptiveFollowUp) return null;
    
    // Static color classes to avoid Tailwind purging
    const colorClasses = {
      aggressive: { text: 'text-red-500', icon: Sword },
      cooperative: { text: 'text-green-500', icon: Users },
      cautious: { text: 'text-blue-500', icon: Eye }
    };
    
    if (aggression >= cooperation && aggression >= caution) {
      return {
        type: 'aggressive',
        content: currentData.adaptiveFollowUp.aggressive,
        icon: colorClasses.aggressive.icon,
        textColor: colorClasses.aggressive.text
      };
    } else if (cooperation >= caution) {
      return {
        type: 'cooperative', 
        content: currentData.adaptiveFollowUp.cooperative,
        icon: colorClasses.cooperative.icon,
        textColor: colorClasses.cooperative.text
      };
    } else {
      return {
        type: 'cautious',
        content: currentData.adaptiveFollowUp.cautious,
        icon: colorClasses.cautious.icon,
        textColor: colorClasses.cautious.text
      };
    }
  };

  // Handle initial choice selection - opens reasoning dialog
  const handleChoiceSelection = (choiceId: string) => {
    setSelectedChoice(choiceId);
    setShowReasoningDialog(true);
  };

  // Process final decision after reasoning is captured
  const makeDecision = (choiceId: string, reasoning: string, confidence: number) => {
    // Get context-based weights and apply assumption adjustments
    const contextWeights = contextChoiceWeights[educationContext as keyof typeof contextChoiceWeights][choiceId as keyof typeof contextChoiceWeights.business];
    const adjustedWeights = getAdjustedWeights(choiceId);
    
    // Combine context and assumption weights
    const finalWeights = {
      cooperation: contextWeights.cooperation * adjustedWeights.cooperation,
      caution: contextWeights.caution * adjustedWeights.caution,
      aggression: contextWeights.aggression * adjustedWeights.aggression,
    };
    
    setScores(prevScores => ({
      cooperation: prevScores.cooperation + finalWeights.cooperation,
      caution: prevScores.caution + finalWeights.caution,
      aggression: prevScores.aggression + finalWeights.aggression,
    }));
    
    setShowConsequence(true);
    
    // Enhanced decision tracking with assumptions and timing
    const timeSpent = Date.now() - decisionStartTime;
    setPlayerDecisions([...playerDecisions, { 
      scenario: currentScenario, 
      choice: choiceId, 
      timestamp: new Date().toISOString(),
      reasoning: reasoning,
      confidence: confidence,
      timeSpent: timeSpent
    }]);
    
    // Reset for next decision
    setCurrentReasoning('');
    setCurrentConfidence(5);
    setShowReasoningDialog(false);
  };

  const nextScenario = () => {
    const scenarioList = scenarios[educationContext as keyof typeof scenarios];
    if (currentScenario < scenarioList.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedChoice('');
      setShowConsequence(false);
      setDecisionStartTime(Date.now()); // Reset decision timer for new scenario
    } else {
      setCurrentStep('results');
    }
  };

  // Reset assumptions to default values
  const resetAssumptions = () => {
    setAssumptions({
      communicationDifficulty: 7,
      resourceScarcity: 6,
      trustVerification: 8,
      technologicalThreat: 5
    });
  };

  // Calculate assumption-adjusted scoring weights
  const getAdjustedWeights = (choice: string) => {
    const baseWeights = {
      communicate: { cooperation: 3, caution: 1, aggression: 0 },
      silence: { cooperation: 1, caution: 3, aggression: 1 },
      escalate: { cooperation: 0, caution: 1, aggression: 3 }
    };

    const base = baseWeights[choice as keyof typeof baseWeights];
    
    // Adjust weights based on assumptions
    const adjustedWeights = {
      cooperation: Math.max(0, base.cooperation - (assumptions.communicationDifficulty - 5) * 0.3 - (assumptions.resourceScarcity - 5) * 0.2),
      caution: Math.max(0, base.caution + (assumptions.trustVerification - 5) * 0.3),
      aggression: Math.max(0, base.aggression + (assumptions.technologicalThreat - 5) * 0.3 + (assumptions.resourceScarcity - 5) * 0.2)
    };

    return adjustedWeights;
  };

  const getProfile = () => {
    const { cooperation, caution, aggression } = scores;

    if (aggression >= cooperation && aggression >= caution) {
      return {
        type: 'Dark Forest Adherent',
        description: 'You prioritize eliminating threats preemptively, embodying core Dark Forest logic',
        tendency: 'Assumes hostile intent and acts first to ensure survival'
      };
    } else if (cooperation >= caution) {
      return {
        type: 'Collaborative Optimist',
        description: 'You believe cooperation and communication can overcome uncertainty',
        tendency: 'Assumes good faith is possible and seeks mutual benefit'
      };
    } else {
      return {
        type: 'Strategic Observer',
        description: 'You prefer gathering information before committing to action',
        tendency: 'Balances caution with opportunity assessment'
      };
    }
  };

  const resetSimulation = () => {
    setCurrentStep('intro');
    setCurrentScenario(0);
    setPlayerDecisions([]);
    setScores({ cooperation: 0, caution: 0, aggression: 0 });
    setSelectedChoice('');
    setShowConsequence(false);
    setShowCriticisms(false);
    setKeyboardNavigationEnabled(false);
    setFocusedChoiceIndex(0);
    setCurrentReasoning('');
    setCurrentConfidence(5);
    setShowReasoningDialog(false);
    setDecisionStartTime(Date.now());
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (currentStep !== 'simulation' || selectedChoice) return;

      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          setKeyboardNavigationEnabled(true);
          setFocusedChoiceIndex(prev => prev > 0 ? prev - 1 : darkForestChoices.length - 1);
          break;
        case 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          setKeyboardNavigationEnabled(true);
          setFocusedChoiceIndex(prev => prev < darkForestChoices.length - 1 ? prev + 1 : 0);
          break;
        case 'Enter':
        case ' ':
          if (keyboardNavigationEnabled) {
            event.preventDefault();
            makeDecisionFixed(darkForestChoices[focusedChoiceIndex].id);
          }
          break;
        case 'Escape':
          event.preventDefault();
          setKeyboardNavigationEnabled(false);
          setFocusedChoiceIndex(0);
          break;
        case '1':
        case '2':
        case '3':
          event.preventDefault();
          const choiceIndex = parseInt(event.key) - 1;
          if (choiceIndex < darkForestChoices.length) {
            makeDecisionFixed(darkForestChoices[choiceIndex].id);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentStep, selectedChoice, keyboardNavigationEnabled, focusedChoiceIndex]);

  // Navigation between scenarios with proper state management
  const navigateToScenario = (scenarioIndex: number) => {
    if (scenarioIndex >= 0 && scenarioIndex < scenarios[educationContext as keyof typeof scenarios].length) {
      setCurrentScenario(scenarioIndex);
      setShowConsequence(false);
      setKeyboardNavigationEnabled(false);
      setFocusedChoiceIndex(0);
      
      // Check if this scenario was already answered
      const existingDecision = playerDecisions.find(d => d.scenario === scenarioIndex);
      if (existingDecision) {
        setSelectedChoice(existingDecision.choice);
      } else {
        setSelectedChoice('');
      }
    }
  };

  // Fixed decision making to prevent double-counting
  const makeDecisionFixed = (choiceId: string) => {
    if (selectedChoice) return; // Prevent multiple selections
    
    // Remove any existing decision for this scenario to prevent double-counting
    const filteredDecisions = playerDecisions.filter(d => d.scenario !== currentScenario);
    
    // Recalculate scores from filtered decisions
    const recalculatedScores = { cooperation: 0, caution: 0, aggression: 0 };
    filteredDecisions.forEach(decision => {
      const context = educationContext as keyof typeof contextChoiceWeights;
      const weights = contextChoiceWeights[context][decision.choice as keyof typeof contextChoiceWeights.business];
      recalculatedScores.cooperation += weights.cooperation;
      recalculatedScores.caution += weights.caution;
      recalculatedScores.aggression += weights.aggression;
    });
    
    // Add new decision weights
    const context = educationContext as keyof typeof contextChoiceWeights;
    const weights = contextChoiceWeights[context][choiceId as keyof typeof contextChoiceWeights.business];
    recalculatedScores.cooperation += weights.cooperation;
    recalculatedScores.caution += weights.caution;
    recalculatedScores.aggression += weights.aggression;
    
    // Update state
    const newDecision = {
      scenario: currentScenario,
      choice: choiceId,
      timestamp: new Date().toISOString()
    };
    
    setPlayerDecisions([...filteredDecisions, newDecision]);
    setScores(recalculatedScores);
    setSelectedChoice(choiceId);
    setTimeout(() => setShowConsequence(true), 500);
  };

  // Progress indicator component
  const ProgressIndicator = () => {
    const totalScenarios = scenarios[educationContext as keyof typeof scenarios].length;
    const progress = ((currentScenario + 1) / totalScenarios) * 100;
    
    return (
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Progress</span>
          <span data-testid="text-scenario-progress">
            Scenario {currentScenario + 1} of {totalScenarios}
          </span>
        </div>
        <div 
          className="w-full bg-muted rounded-full h-2 mb-4"
          role="progressbar"
          aria-valuenow={currentScenario + 1}
          aria-valuemin={1}
          aria-valuemax={totalScenarios}
          aria-label={`Simulation progress: scenario ${currentScenario + 1} of ${totalScenarios}`}
        >
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
            data-testid="progress-bar"
          />
        </div>
        <div className="flex justify-between">
          {Array.from({ length: totalScenarios }).map((_, index) => (
            <button
              key={index}
              onClick={() => navigateToScenario(index)}
              className={`w-8 h-8 rounded-full text-xs font-semibold transition-all ${
                index === currentScenario 
                  ? 'bg-primary text-primary-foreground scale-110' 
                  : index < currentScenario 
                    ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                    : 'bg-muted text-muted-foreground hover:bg-muted-foreground/20'
              }`}
              disabled={index > currentScenario}
              data-testid={`scenario-nav-${index}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Helper function to format decisions for visualizations
  const formatDecisionsForVisualization = () => {
    return playerDecisions.map((decision) => {
      const weights = contextChoiceWeights[educationContext as keyof typeof contextChoiceWeights][decision.choice as keyof typeof contextChoiceWeights.business];
      return {
        scenario: decision.scenario,
        choice: decision.choice,
        timestamp: decision.timestamp,
        cooperation: weights.cooperation,
        caution: weights.caution,
        aggression: weights.aggression,
        context: educationContext
      };
    });
  };

  const exportResults = (format: 'json' | 'csv' | 'html' | 'txt' = 'json') => {
    const detailedDecisions = playerDecisions.map(decision => {
      const scenarioData = scenarios[educationContext as keyof typeof scenarios][decision.scenario];
      const choiceData = darkForestChoices.find(c => c.id === decision.choice);
      const weightsApplied = contextChoiceWeights[educationContext as keyof typeof contextChoiceWeights][decision.choice as keyof typeof contextChoiceWeights.business];
      return {
        scenarioTitle: scenarioData.title,
        realWorldAnalogy: scenarioData.realWorld,
        choiceLabel: choiceData?.label,
        choiceId: decision.choice,
        timestamp: decision.timestamp,
        weightsApplied: weightsApplied,
      };
    });

    const results = {
      sessionId: `session_${Date.now()}`,
      exportDate: new Date().toISOString(),
      profile: getProfile(),
      context: educationContext,
      detailedDecisions: detailedDecisions,
      finalScores: scores,
      normalizedScores: {
        cooperation: (scores.cooperation / Math.max(1, playerDecisions.length)).toFixed(2),
        caution: (scores.caution / Math.max(1, playerDecisions.length)).toFixed(2),
        aggression: (scores.aggression / Math.max(1, playerDecisions.length)).toFixed(2),
      },
    };

    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `dark_forest_results_${dateStr}`;
    
    let content: string;
    let mimeType: string;
    let fileExtension: string;

    switch (format) {
      case 'csv':
        content = generateCSV(results);
        mimeType = 'text/csv';
        fileExtension = 'csv';
        break;
      case 'html':
        content = generateHTML(results);
        mimeType = 'text/html';
        fileExtension = 'html';
        break;
      case 'txt':
        content = generateTXT(results);
        mimeType = 'text/plain';
        fileExtension = 'txt';
        break;
      default:
        content = JSON.stringify(results, null, 2);
        mimeType = 'text/json';
        fileExtension = 'json';
    }

    const dataString = `data:${mimeType};charset=utf-8,${encodeURIComponent(content)}`;
    const link = document.createElement("a");
    link.href = dataString;
    link.download = `${fileName}.${fileExtension}`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateCSV = (results: any) => {
    const profile = results.profile;
    const normalizedScores = results.normalizedScores;
    
    let csv = 'Category,Value\n';
    csv += `Session ID,${results.sessionId}\n`;
    csv += `Export Date,${results.exportDate}\n`;
    csv += `Context,${results.context}\n`;
    csv += `Profile Type,${profile.type}\n`;
    csv += `Profile Description,${profile.description}\n`;
    csv += `Cooperation Score,${normalizedScores.cooperation}\n`;
    csv += `Caution Score,${normalizedScores.caution}\n`;
    csv += `Aggression Score,${normalizedScores.aggression}\n\n`;
    
    csv += 'Scenario,Choice,Timestamp,Cooperation Weight,Caution Weight,Aggression Weight\n';
    results.detailedDecisions.forEach((decision: any) => {
      csv += `"${decision.scenarioTitle}","${decision.choiceLabel}","${decision.timestamp}",${decision.weightsApplied.cooperation},${decision.weightsApplied.caution},${decision.weightsApplied.aggression}\n`;
    });
    
    return csv;
  };

  const generateHTML = (results: any) => {
    const profile = results.profile;
    const normalizedScores = results.normalizedScores;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dark Forest Simulation Results</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        h1, h2 { color: #333; }
        .header { background: #f4f4f4; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .profile { background: #e8f4f8; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .scores { display: flex; gap: 20px; margin: 20px 0; }
        .score-card { background: #f9f9f9; padding: 15px; border-radius: 8px; flex: 1; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #f4f4f4; }
        .cooperation { color: #2d5a27; }
        .caution { color: #8b5a00; }
        .aggression { color: #a91e22; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Dark Forest Simulation Results</h1>
        <p><strong>Session ID:</strong> ${results.sessionId}</p>
        <p><strong>Export Date:</strong> ${new Date(results.exportDate).toLocaleDateString()}</p>
        <p><strong>Context:</strong> ${results.context}</p>
    </div>

    <div class="profile">
        <h2>Strategic Profile</h2>
        <h3>${profile.type}</h3>
        <p>${profile.description}</p>
        <p><em>${profile.tendency}</em></p>
    </div>

    <h2>Decision Analysis Scores</h2>
    <div class="scores">
        <div class="score-card">
            <h3 class="cooperation">Cooperation</h3>
            <p><strong>${normalizedScores.cooperation}</strong></p>
            <p>Seeking mutual benefit</p>
        </div>
        <div class="score-card">
            <h3 class="caution">Caution</h3>
            <p><strong>${normalizedScores.caution}</strong></p>
            <p>Information gathering focus</p>
        </div>
        <div class="score-card">
            <h3 class="aggression">Aggression</h3>
            <p><strong>${normalizedScores.aggression}</strong></p>
            <p>Preemptive action tendency</p>
        </div>
    </div>

    <h2>Detailed Decisions</h2>
    <table>
        <thead>
            <tr>
                <th>Scenario</th>
                <th>Choice Made</th>
                <th>Cooperation Weight</th>
                <th>Caution Weight</th>
                <th>Aggression Weight</th>
            </tr>
        </thead>
        <tbody>
            ${results.detailedDecisions.map((decision: any) => `
                <tr>
                    <td>${decision.scenarioTitle}</td>
                    <td>${decision.choiceLabel}</td>
                    <td class="cooperation">${decision.weightsApplied.cooperation}</td>
                    <td class="caution">${decision.weightsApplied.caution}</td>
                    <td class="aggression">${decision.weightsApplied.aggression}</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
</body>
</html>`;
  };

  const generateTXT = (results: any) => {
    const profile = results.profile;
    const normalizedScores = results.normalizedScores;
    
    let txt = 'DARK FOREST SIMULATION RESULTS\n';
    txt += '================================\n\n';
    txt += `Session ID: ${results.sessionId}\n`;
    txt += `Export Date: ${new Date(results.exportDate).toLocaleDateString()}\n`;
    txt += `Context: ${results.context}\n\n`;
    
    txt += 'STRATEGIC PROFILE\n';
    txt += '-----------------\n';
    txt += `Type: ${profile.type}\n`;
    txt += `Description: ${profile.description}\n`;
    txt += `Tendency: ${profile.tendency}\n\n`;
    
    txt += 'DECISION ANALYSIS SCORES\n';
    txt += '------------------------\n';
    txt += `Cooperation Score: ${normalizedScores.cooperation} (Seeking mutual benefit)\n`;
    txt += `Caution Score: ${normalizedScores.caution} (Information gathering focus)\n`;
    txt += `Aggression Score: ${normalizedScores.aggression} (Preemptive action tendency)\n\n`;
    
    txt += 'DETAILED DECISIONS\n';
    txt += '------------------\n';
    results.detailedDecisions.forEach((decision: any, index: number) => {
      txt += `${index + 1}. ${decision.scenarioTitle}\n`;
      txt += `   Choice: ${decision.choiceLabel}\n`;
      txt += `   Weights Applied - Cooperation: ${decision.weightsApplied.cooperation}, Caution: ${decision.weightsApplied.caution}, Aggression: ${decision.weightsApplied.aggression}\n\n`;
    });
    
    return txt;
  };


  // --- Component Rendering ---

  if (currentStep === 'intro') {
    return (
      <div className="min-h-screen bg-background text-foreground p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <Radio className="w-16 h-16 text-red-500 mx-auto mb-4" data-testid="icon-radio" />
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2" data-testid="title-main">
                  The <GlossaryTerm term="dark-forest">Dark Forest Theory</GlossaryTerm>
                </h1>
                <p className="text-xl text-muted-foreground" data-testid="text-subtitle">
                  A chilling solution to the <GlossaryTerm term="fermi-paradox">Fermi Paradox</GlossaryTerm> - but does it hold up?
                </p>
              </div>
              <div className="flex gap-3">
                <AssumptionLab
                  assumptions={assumptions}
                  onAssumptionsChange={setAssumptions}
                  onReset={resetAssumptions}
                />
                <GlossaryDialog>
                  <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors" data-testid="button-glossary">
                    <BookOpen className="w-4 h-4" />
                    Glossary
                  </button>
                </GlossaryDialog>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl p-6 mb-8 border border-border">
            <h2 className="text-2xl font-semibold mb-4 text-center" data-testid="title-metaphor">
              Beyond Sci-Fi: The Theory as a Metaphor for <GlossaryTerm term="game-theory">Game Theory</GlossaryTerm>
            </h2>
            <p className="text-sm text-muted-foreground" data-testid="text-description">
              The <GlossaryTerm term="dark-forest">Dark Forest theory</GlossaryTerm> is more than just a chilling answer to the <GlossaryTerm term="fermi-paradox">Fermi Paradox</GlossaryTerm>. It's a high-stakes thought experiment in <GlossaryTerm term="game-theory"><strong>game theory</strong></GlossaryTerm>, providing a powerful lens for analyzing conflict, cooperation, and competition in other disciplines. By reframing the cosmic "dark forest" as a metaphorical "market forest," we can gain new insights into strategic decision-making in business, policy, and beyond.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Theory Explanation */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <h2 className="text-2xl font-semibold text-red-500 mb-4 flex items-center" data-testid="title-theory">
                <AlertTriangle className="w-6 h-6 mr-2" />
                The Dark Forest Logic
              </h2>

              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                <p className="text-red-800 dark:text-red-100 italic text-sm" data-testid="text-quote">
                  "The universe is a dark forest. Every civilization is an armed hunter.
                  Discovery means destruction, so civilizations must remain silent or strike first."
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-primary" data-testid="title-assumptions">Core Assumptions:</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start">
                    <span className="w-4 h-4 bg-primary rounded-full text-xs flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 text-white">1</span>
                    <span data-testid="assumption-1">All civilizations prioritize survival above all else</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-4 h-4 bg-primary rounded-full text-xs flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 text-white">2</span>
                    <span data-testid="assumption-2">Resources are finite, creating zero-sum competition</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-4 h-4 bg-primary rounded-full text-xs flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 text-white">3</span>
                    <span data-testid="assumption-3">Trust verification impossible across interstellar distances</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-4 h-4 bg-primary rounded-full text-xs flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 text-white">4</span>
                    <span data-testid="assumption-4">Technological advancement creates unpredictable threats</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center mr-2 mt-0.5 flex-shrink-0 text-white">∴</span>
                    <span className="text-red-500 font-medium" data-testid="conclusion">Therefore: Remain silent or eliminate others first</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded">
                <p className="text-yellow-800 dark:text-yellow-100 text-sm" data-testid="text-options">
                  <strong>Three Options:</strong> Communicate (risky), Stay Silent (safe), or Strike First (survival)
                </p>
              </div>
            </div>

            {/* Criticisms */}
            <div className="bg-card rounded-xl p-6 border border-border">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-green-600 flex items-center" data-testid="title-analysis">
                  <BookOpen className="w-6 h-6 mr-2" />
                  Critical Analysis
                </h2>
                <button
                  onClick={() => setShowCriticisms(!showCriticisms)}
                  className="px-4 py-2 text-sm rounded bg-green-600 hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 min-w-[100px] text-white"
                  data-testid="button-toggle-criticisms"
                >
                  {showCriticisms ? 'Hide' : 'Show'} Criticisms
                </button>
              </div>

              {showCriticisms && (
                <div className="space-y-4" data-testid="section-criticisms">
                  <div>
                    <h3 className="font-semibold text-red-500 mb-2" data-testid="title-logical-flaws">Logical Flaws:</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {criticisms.logical.map((item, index) => (
                        <li key={index} className="flex items-start" data-testid={`logical-criticism-${index}`}>
                          <span className="text-red-500 mr-2">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-yellow-500 mb-2" data-testid="title-empirical-problems">Empirical Problems:</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {criticisms.empirical.map((item, index) => (
                        <li key={index} className="flex items-start" data-testid={`empirical-criticism-${index}`}>
                          <span className="text-yellow-500 mr-2">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-purple-500 mb-2" data-testid="title-ethical-concerns">Ethical Concerns:</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {criticisms.ethical.map((item, index) => (
                        <li key={index} className="flex items-start" data-testid={`ethical-criticism-${index}`}>
                          <span className="text-purple-500 mr-2">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {!showCriticisms && (
                <div className="text-center py-8" data-testid="section-criticisms-hidden">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Click to explore criticisms from multiple academic perspectives</p>
                </div>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-center" data-testid="title-disciplines">Test the Theory Through Academic Disciplines</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(contexts).map(([key, context]) => {
                const Icon = context.icon;
                const criticism = disciplineCriticisms[key as keyof typeof disciplineCriticisms];
                return (
                  <button
                    key={key}
                    onClick={() => setEducationContext(key)}
                    className={`p-6 rounded-xl border-2 text-left transition-all min-h-[160px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                      educationContext === key
                        ? 'border-primary bg-secondary'
                        : 'border-border bg-card hover:border-muted-foreground'
                    }`}
                    data-testid={`button-context-${key}`}
                  >
                    <div className="flex items-center space-x-4 mb-3">
                      <Icon className={`w-8 h-8 ${
                        context.color === 'blue' ? 'text-blue-500' :
                        context.color === 'purple' ? 'text-purple-500' :
                        context.color === 'green' ? 'text-green-500' : 'text-red-500'
                      }`} />
                      <div>
                        <h3 className="text-xl font-bold" data-testid={`text-context-name-${key}`}>{context.name}</h3>
                        <p className="text-sm text-muted-foreground" data-testid={`text-context-description-${key}`}>{context.description}</p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <strong className="text-yellow-500">Challenge:</strong> <span data-testid={`text-context-challenge-${key}`}>{criticism.flaws}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => {
                setCurrentStep('simulation');
                setDecisionStartTime(Date.now()); // Initialize decision timer
              }}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary"
              data-testid="button-begin-analysis"
            >
              <Zap className="w-5 h-5 inline mr-2" />
              Begin Dark Forest Analysis
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'simulation') {
    const currentData = scenarios[educationContext as keyof typeof scenarios][currentScenario];
    const context = contexts[educationContext as keyof typeof contexts];

    return (
      <div className="min-h-screen bg-background text-foreground p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold flex items-center" data-testid="title-context">
              <context.icon className={`w-8 h-8 mr-4 ${
                context.color === 'blue' ? 'text-blue-500' :
                context.color === 'purple' ? 'text-purple-500' :
                context.color === 'green' ? 'text-green-500' : 'text-red-500'
              }`} />
              {context.name}
            </h2>
            <ProgressIndicator />
          </div>
          
          {keyboardNavigationEnabled && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4 text-sm text-blue-800 dark:text-blue-200">
              <div className="flex items-center gap-2">
                <kbd className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded text-xs">←→</kbd>
                <span>Navigate choices</span>
                <kbd className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded text-xs">Enter</kbd>
                <span>Select</span>
                <kbd className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded text-xs">1-3</kbd>
                <span>Quick select</span>
                <kbd className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded text-xs">Esc</kbd>
                <span>Exit keyboard mode</span>
              </div>
            </div>
          )}

          <div className="bg-card rounded-xl p-6 mb-8 border border-border">
            <h3 className="text-xl md:text-2xl font-semibold text-center mb-4 text-blue-600" data-testid="title-scenario">{currentData.title}</h3>

            <div className="space-y-4 text-sm md:text-base">
              <p className="p-4 rounded-lg bg-secondary text-foreground">
                <span className="font-semibold text-yellow-500 block mb-1">Cosmic Scenario:</span> 
                <span data-testid="text-cosmic-scenario">{currentData.cosmic}</span>
              </p>
              <p className="p-4 rounded-lg bg-secondary text-foreground">
                <span className="font-semibold text-green-500 block mb-1">Real-World Analogy:</span> 
                <span data-testid="text-real-world-analogy">{currentData.realWorld}</span>
              </p>
              <div className="p-4 rounded-lg bg-secondary text-foreground">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-purple-500">Examples:</span>
                  {currentData.detailedCaseStudy && (
                    <CaseStudyDialog scenario={currentData}>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs"
                        data-testid="button-case-studies"
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        Detailed Case Studies
                      </Button>
                    </CaseStudyDialog>
                  )}
                </div>
                <ul className="list-disc list-inside space-y-1">
                  {currentData.examples.map((example, index) => (
                    <li key={index} data-testid={`text-example-${index}`}>{example}</li>
                  ))}
                </ul>
                {!currentData.detailedCaseStudy && (
                  <p className="text-xs text-muted-foreground mt-2 italic">
                    More detailed case studies coming soon for this context.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigateToScenario(currentScenario - 1)}
              disabled={currentScenario === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              data-testid="button-prev-scenario"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            
            <h3 className="text-2xl font-semibold text-center" data-testid="title-decision">Your Decision</h3>
            
            <button
              onClick={() => navigateToScenario(currentScenario + 1)}
              disabled={currentScenario >= scenarios[educationContext as keyof typeof scenarios].length - 1 || !selectedChoice}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              data-testid="button-next-scenario"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            role="radiogroup"
            aria-label="Choose your strategic decision"
            tabIndex={0}
            onFocus={() => setKeyboardNavigationEnabled(true)}
          >
            {darkForestChoices.map((choice, index) => {
              const Icon = choice.icon;
              return (
                <button
                  key={choice.id}
                  onClick={() => handleChoiceSelection(choice.id)}
                  className={`p-6 rounded-xl border-2 text-left transition-all min-h-[160px] md:min-h-[220px] relative
                    ${selectedChoice === choice.id ? 'border-primary bg-secondary' : 'border-border bg-card hover:border-muted-foreground'}
                    ${selectedChoice && selectedChoice !== choice.id ? 'opacity-50 pointer-events-none' : ''}
                    ${keyboardNavigationEnabled && focusedChoiceIndex === index ? 'ring-2 ring-primary ring-offset-2' : ''}
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
                  role="radio"
                  aria-checked={selectedChoice === choice.id}
                  tabIndex={keyboardNavigationEnabled && focusedChoiceIndex === index ? 0 : -1}
                  data-testid={`button-choice-${choice.id}`}
                >
                  <div className={`text-xl font-bold flex items-center mb-2 ${
                    choice.color === 'green' ? 'text-green-500' :
                    choice.color === 'yellow' ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    <Icon className="w-6 h-6 mr-2" />
                    <span data-testid={`text-choice-label-${choice.id}`}>{choice.label}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4" data-testid={`text-choice-theory-${choice.id}`}>{choice.theory}</p>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className={`text-sm font-semibold ${
                      choice.color === 'green' ? 'text-green-500' :
                      choice.color === 'yellow' ? 'text-yellow-500' : 'text-red-500'
                    }`} data-testid={`text-choice-risk-${choice.id}`}>
                      Risk: {choice.risk}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {showConsequence && (
            <div className="bg-card rounded-xl p-6 border border-border" data-testid="section-consequences">
              <h3 className="text-xl font-bold mb-4 text-center" data-testid="title-consequences">Consequences of Your Choice</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-950/30 p-4 rounded-lg border border-red-800">
                  <h4 className="font-semibold text-red-400 mb-2 flex items-center" data-testid="title-dark-forest-view">
                    <Sword className="w-5 h-5 mr-2" /> Dark Forest View
                  </h4>
                  <p className="text-sm text-red-100" data-testid="text-dark-forest-consequence">{consequences[selectedChoice as keyof typeof consequences].darkForest}</p>
                </div>
                <div className="bg-green-950/30 p-4 rounded-lg border border-green-800">
                  <h4 className="font-semibold text-green-400 mb-2 flex items-center" data-testid="title-alternative-view">
                    <Zap className="w-5 h-5 mr-2" /> Alternative Perspective
                  </h4>
                  <p className="text-sm text-green-100" data-testid="text-alternative-consequence">{consequences[selectedChoice as keyof typeof consequences].alternative}</p>
                </div>
              </div>
              
              {/* Adaptive Follow-up based on player's tendency */}
              {(() => {
                const followUp = getAdaptiveFollowUp();
                if (!followUp) return null;
                
                const IconComponent = followUp.icon;
                return (
                  <div className="mt-6 bg-card/50 rounded-lg p-4 border border-border" data-testid="section-adaptive-followup">
                    <div className="flex items-center gap-2 mb-3">
                      <IconComponent className={`w-5 h-5 ${followUp.textColor}`} />
                      <h4 className={`font-semibold ${followUp.textColor} capitalize`} data-testid="title-adaptive-followup">
                        {followUp.type} Approach Detected
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground" data-testid="text-adaptive-followup">
                      {followUp.content}
                    </p>
                  </div>
                );
              })()}
              
              <div className="text-center mt-6">
                <button
                  onClick={nextScenario}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl font-semibold text-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary min-w-[150px]"
                  data-testid="button-next-scenario"
                >
                  {currentScenario === scenarios[educationContext as keyof typeof scenarios].length - 1 ? 'See Results' : 'Next Scenario'}
                </button>
              </div>
            </div>
          )}

          {/* Reasoning Capture Dialog */}
          <ReasoningDialog
            isOpen={showReasoningDialog}
            onClose={() => {
              // Finalize decision with defaults when skipped
              makeDecision(selectedChoice, '', 5);
            }}
            onSubmit={(reasoning, confidence) => {
              makeDecision(selectedChoice, reasoning, confidence);
            }}
            choiceLabel={selectedChoice ? darkForestChoices.find(c => c.id === selectedChoice)?.label || '' : ''}
            initialReasoning={currentReasoning}
            initialConfidence={currentConfidence}
          />
        </div>
      </div>
    );
  }

  if (currentStep === 'results') {
    const profile = getProfile();
    const context = contexts[educationContext as keyof typeof contexts];
    const criticism = disciplineCriticisms[educationContext as keyof typeof disciplineCriticisms];
    
    const totalScenarios = playerDecisions.length;
    const normalizedScores = {
      cooperation: (scores.cooperation / totalScenarios).toFixed(2),
      caution: (scores.caution / totalScenarios).toFixed(2),
      aggression: (scores.aggression / totalScenarios).toFixed(2),
    };

    return (
      <div className="min-h-screen bg-background text-foreground p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2" data-testid="title-results">Leadership Decision Profile</h1>
            <p className="text-muted-foreground" data-testid="text-results-subtitle">Your strategic mindset revealed through {context.name.toLowerCase()} scenarios</p>
            <p className="text-sm text-muted-foreground mt-2" data-testid="text-decisions-count">Based on {playerDecisions.length} critical decisions under uncertainty</p>
          </div>

          <div className="w-full space-y-8">
              <div className="bg-primary rounded-xl p-8">
            <div className="flex flex-col md:flex-row items-center mb-4">
              <context.icon className="w-10 h-10 mb-4 md:mb-0 mr-0 md:mr-4 text-primary-foreground" />
              <div>
                <h2 className="text-2xl font-bold text-center md:text-left text-primary-foreground" data-testid="text-profile-type">Decision-Making Profile: {profile.type}</h2>
                <p className="text-primary-foreground/90 text-center md:text-left" data-testid="text-profile-description">{profile.description}</p>
                <p className="text-primary-foreground/90 text-sm mt-1 text-center md:text-left" data-testid="text-profile-tendency"><strong>Leadership Tendency:</strong> {profile.tendency}</p>
              </div>
            </div>

            <div className="bg-primary/70 rounded-lg p-4 mt-4">
              <h3 className="font-semibold text-primary-foreground mb-2">Leadership Implications:</h3>
              <p className="text-primary-foreground text-sm" data-testid="text-leadership-implications">
                {profile.type === 'Dark Forest Adherent' ?
                  'Strong crisis leadership, decisive under pressure, may struggle with collaborative environments. Excels in competitive, high-stakes situations.' :
                profile.type === 'Collaborative Optimist' ?
                  'Natural team builder, strong in partnerships and innovation. May need support in hostile competitive environments. Excels in growth and transformation scenarios.' :
                  'Excellent strategic thinking, balanced risk assessment. Natural analyst and advisor. Excels in complex, multi-stakeholder environments.'
                }
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-xl font-semibold mb-4" data-testid="title-decision-path">Your Decision Path</h3>
              <div className="space-y-3">
                {playerDecisions.map((decision, index) => {
                  const scenario = scenarios[educationContext as keyof typeof scenarios][decision.scenario];
                  const choice = darkForestChoices.find(c => c.id === decision.choice);
                  return (
                    <div key={index} className="bg-secondary rounded-lg p-3" data-testid={`decision-${index}`}>
                      <div className="font-medium text-sm" data-testid={`decision-title-${index}`}>{scenario.title}</div>
                      <div className={`text-sm ${
                        choice?.color === 'green' ? 'text-green-500' :
                        choice?.color === 'yellow' ? 'text-yellow-500' : 'text-red-500'
                      }`} data-testid={`decision-choice-${index}`}>
                        {choice?.label}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1" data-testid={`decision-example-${index}`}>
                        Real-world: {scenario.examples[0]}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-xl font-semibold mb-4" data-testid="title-scores">Your Weighted Scores 📊</h3>
              <div className="space-y-4">
                <div className="bg-green-950/30 rounded-lg p-4 border border-green-800">
                  <h4 className="font-semibold text-green-400" data-testid="score-cooperation">Cooperation Score: {normalizedScores.cooperation}</h4>
                  <p className="text-sm text-green-100 mt-1">
                    An average of your score per decision. You leaned towards seeking mutual benefit.
                  </p>
                </div>
                <div className="bg-yellow-950/30 rounded-lg p-4 border border-yellow-800">
                  <h4 className="font-semibold text-yellow-400" data-testid="score-caution">Caution Score: {normalizedScores.caution}</h4>
                  <p className="text-sm text-yellow-100 mt-1">
                    An average of your score per decision. You prioritized information gathering and risk assessment.
                  </p>
                </div>
                <div className="bg-red-950/30 rounded-lg p-4 border border-red-800">
                  <h4 className="font-semibold text-red-400" data-testid="score-aggression">Aggression Score: {normalizedScores.aggression}</h4>
                  <p className="text-sm text-red-100 mt-1">
                    An average of your score per decision. You leaned towards preemptive action for survival.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-xl font-semibold mb-4" data-testid="title-critique">
                {context.name} Critique
              </h3>
              <div className="space-y-4">
                <div className="bg-purple-950/30 rounded-lg p-4 border border-purple-800">
                  <h4 className="font-semibold text-purple-400 mb-2">Theory Challenges</h4>
                  <p className="text-sm text-purple-100 mb-3" data-testid="text-critique-flaws">{criticism.flaws}</p>
                  <h5 className="font-medium text-purple-300 mb-2 text-xs">Supporting Examples:</h5>
                  <ul className="text-xs text-purple-100 space-y-1">
                    {criticism.examples.map((example, index) => (
                      <li key={index} className="flex items-start" data-testid={`critique-example-${index}`}>
                        <span className="text-purple-400 mr-2">•</span>
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-secondary rounded-lg p-4">
                  <h4 className="font-semibold text-foreground mb-2">Implications</h4>
                  <p className="text-sm text-foreground" data-testid="text-profile-implications">
                    Your {profile.type.toLowerCase()} approach aligns with {
                      profile.type === 'Dark Forest Adherent' ? 'realist assumptions but may miss cooperative opportunities' :
                      profile.type === 'Collaborative Optimist' ? 'liberal institutionalist thinking about mutual benefit' :
                      'balanced strategic thinking that weighs multiple factors'
                    } in {context.name.toLowerCase()}.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-8 space-y-4">
            <div className="space-x-4">
              <button
                onClick={() => exportResults('json')}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-green-400"
                data-testid="button-export-json"
              >
                <Download className="w-4 h-4 inline mr-2" />
                Export JSON
              </button>
              <button
                onClick={() => exportResults('csv')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
                data-testid="button-export-csv"
              >
                <Download className="w-4 h-4 inline mr-2" />
                Export CSV
              </button>
              <button
                onClick={() => exportResults('html')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-purple-400"
                data-testid="button-export-html"
              >
                <Download className="w-4 h-4 inline mr-2" />
                Export HTML
              </button>
              <button
                onClick={() => exportResults('txt')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-gray-400"
                data-testid="button-export-txt"
              >
                <Download className="w-4 h-4 inline mr-2" />
                Export Text
              </button>
            </div>
            <div>
              <button
                onClick={resetSimulation}
                className="bg-secondary hover:bg-secondary/90 text-foreground px-8 py-4 rounded-xl font-semibold text-lg transition-all focus:outline-none focus:ring-2 focus:ring-muted"
                data-testid="button-reset-simulation"
              >
                Start Over
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }
  
  // Default fallback return
  return null;
};

export default DarkForestSimulator;