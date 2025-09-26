import { useState } from 'react';
import { Radio, Target, Brain, Atom, Gavel, MessageCircle, Eye, Sword, Globe, AlertTriangle, Clock, Users, Shield, BookOpen, Zap, Download } from 'lucide-react';

const DarkForestSimulator = () => {
  const [currentStep, setCurrentStep] = useState('intro');
  const [currentScenario, setCurrentScenario] = useState(0);
  const [educationContext, setEducationContext] = useState('business');
  const [playerDecisions, setPlayerDecisions] = useState<Array<{scenario: number, choice: string, timestamp: string}>>([]);
  const [scores, setScores] = useState({
    cooperation: 0,
    caution: 0,
    aggression: 0
  });
  const [selectedChoice, setSelectedChoice] = useState('');
  const [showConsequence, setShowConsequence] = useState(false);
  const [showCriticisms, setShowCriticisms] = useState(false);

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
        examples: ["Apple vs. Samsung patent wars", "Uber vs. traditional taxi disruption", "Netflix vs. Blockbuster streaming pivot"]
      },
      {
        title: "MARKET EXPANSION CONFLICT",
        cosmic: "Multiple species colonizing same resource-rich star system.",
        realWorld: "Several major players entering same emerging market with limited capacity.",
        examples: ["Streaming wars (Disney+, Netflix, Amazon)", "Cloud computing dominance (AWS, Azure, GCP)", "Electric vehicle market (Tesla, GM, Ford)"]
      },
      {
        title: "STRATEGIC ALLIANCE DILEMMA",
        cosmic: "Powerful alien federation offers technology sharing but demands submission.",
        realWorld: "Tech giant offers partnership but could eventually acquire or marginalize you.",
        examples: ["Facebook acquiring Instagram/WhatsApp", "Google's Android partnerships", "Microsoft's embrace-extend-extinguish strategy"]
      },
      {
        title: "INFORMATION WARFARE",
        cosmic: "Intercepted alien communications reveal plans to manipulate human behavior.",
        realWorld: "Discovery of competitor using misinformation to damage your brand reputation.",
        examples: ["Social media manipulation campaigns", "Corporate espionage cases", "Astroturfing and fake review attacks"]
      }
    ],
    philosophy: [
      {
        title: "INTERGENERATIONAL CONSENT",
        cosmic: "Current generation making contact decisions binding all future humans.",
        realWorld: "Present actions on climate change determining habitability for centuries.",
        examples: ["Nuclear waste storage decisions", "Genetic engineering of human embryos", "AI development without safety controls"]
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
        examples: ["Gain-of-function virus research", "CRISPR gene editing capabilities", "AI research with military applications"]
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
        examples: ["Climate change negotiations", "COVID-19 vaccine distribution", "Space debris cleanup efforts"]
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
      alternatives: ["Could enable cooperation and mutual benefit", "Builds trust and shared knowledge", "Creates opportunities for peaceful coexistence"]
    },
    {
      id: 'silence',
      label: 'MAINTAIN SILENCE',
      icon: Eye,
      color: 'yellow',
      risk: 'Medium',
      theory: "Remain hidden while gathering intelligence about others",
      darkForestView: "Safest option - preserves anonymity while monitoring threats",
      alternatives: ["May miss opportunities for beneficial contact", "Others might interpret silence as hostility", "Could lead to mutual isolation"]
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

  const makeDecision = (choiceId: string) => {
    const weights = contextChoiceWeights[educationContext as keyof typeof contextChoiceWeights][choiceId as keyof typeof contextChoiceWeights.business];
    
    setScores(prevScores => ({
      cooperation: prevScores.cooperation + weights.cooperation,
      caution: prevScores.caution + weights.caution,
      aggression: prevScores.aggression + weights.aggression,
    }));
    
    setSelectedChoice(choiceId);
    setShowConsequence(true);
    setPlayerDecisions([...playerDecisions, { 
      scenario: currentScenario, 
      choice: choiceId, 
      timestamp: new Date().toISOString()
    }]);
  };

  const nextScenario = () => {
    const scenarioList = scenarios[educationContext as keyof typeof scenarios];
    if (currentScenario < scenarioList.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setSelectedChoice('');
      setShowConsequence(false);
    } else {
      setCurrentStep('results');
    }
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
  };

  const exportResults = () => {
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

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(results, null, 2)
    )}`;

    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `dark_forest_results_${new Date().toISOString().split('T')[0]}.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToGitHub = async () => {
    try {
      const repoName = prompt("Enter repository name:", "dark-forest-simulator");
      if (!repoName) return;

      const description = prompt("Enter description (optional):", "Dark Forest Simulator - Educational Game Theory Tool");
      const isPrivate = confirm("Make repository private?");

      const response = await fetch("/api/github/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repoName,
          description,
          isPrivate,
        }),
      });

      const result = await response.json();

      if (result.success) {
        alert(`Project successfully exported to GitHub!\n\nRepository: ${result.repository.name}\nURL: ${result.repository.url}`);
        window.open(result.repository.url, "_blank");
      } else {
        alert(`Failed to export to GitHub: ${result.error}\n\nDetails: ${result.details}`);
      }
    } catch (error) {
      console.error("GitHub export error:", error);
      alert("Failed to export to GitHub. Please check the console for details.");
    }
  };

  // --- Component Rendering ---

  if (currentStep === 'intro') {
    return (
      <div className="min-h-screen bg-background text-foreground p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <Radio className="w-16 h-16 text-red-500 mx-auto mb-4" data-testid="icon-radio" />
            <h1 className="text-4xl font-bold mb-2" data-testid="title-main">The Dark Forest Theory</h1>
            <p className="text-xl text-muted-foreground" data-testid="text-subtitle">A chilling solution to the Fermi Paradox - but does it hold up?</p>
          </div>

          <div className="bg-card rounded-xl p-6 mb-8 border border-border">
            <h2 className="text-2xl font-semibold mb-4 text-center" data-testid="title-metaphor">Beyond Sci-Fi: The Theory as a Metaphor for Game Theory</h2>
            <p className="text-sm text-muted-foreground" data-testid="text-description">
              The Dark Forest theory is more than just a chilling answer to the Fermi Paradox. It's a high-stakes thought experiment in <strong>game theory</strong>, providing a powerful lens for analyzing conflict, cooperation, and competition in other disciplines. By reframing the cosmic "dark forest" as a metaphorical "market forest," we can gain new insights into strategic decision-making in business, policy, and beyond.
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
              onClick={() => setCurrentStep('simulation')}
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
            <div className="text-muted-foreground font-medium" data-testid="text-scenario-progress">
              Scenario {currentScenario + 1} of {scenarios[educationContext as keyof typeof scenarios].length}
            </div>
          </div>

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
                <span className="font-semibold text-purple-500 block mb-1">Examples:</span>
                <ul className="list-disc list-inside space-y-1">
                  {currentData.examples.map((example, index) => (
                    <li key={index} data-testid={`text-example-${index}`}>{example}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-semibold mb-4 text-center" data-testid="title-decision">Your Decision</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {darkForestChoices.map((choice) => {
              const Icon = choice.icon;
              return (
                <button
                  key={choice.id}
                  onClick={() => makeDecision(choice.id)}
                  className={`p-6 rounded-xl border-2 text-left transition-all min-h-[160px] md:min-h-[220px] relative
                    ${selectedChoice === choice.id ? 'border-primary bg-secondary' : 'border-border bg-card hover:border-muted-foreground'}
                    ${selectedChoice && selectedChoice !== choice.id ? 'opacity-50 pointer-events-none' : ''}
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
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

          <div className="bg-primary rounded-xl p-8 mb-8">
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
          <div className="text-center mt-8 space-x-4">
            <button
              onClick={exportResults}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all focus:outline-none focus:ring-2 focus:ring-green-400"
              data-testid="button-export-results"
            >
              <Download className="w-5 h-5 inline mr-2" />
              Export Results
            </button>
            <button
              onClick={exportToGitHub}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
              data-testid="button-export-github"
            >
              <Globe className="w-5 h-5 inline mr-2" />
              Export to GitHub
            </button>
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
    );
  }
};

export default DarkForestSimulator;