import { useState } from 'react';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ScatterChart,
  Scatter
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  PieChart as PieChartIcon, 
  TrendingUp, 
  Target, 
  Network,
  Thermometer,
  TreePine,
  Activity,
  Download
} from 'lucide-react';

interface DecisionData {
  scenario: number;
  choice: string;
  timestamp: string;
  cooperation: number;
  caution: number;
  aggression: number;
  context: string;
}

interface VisualizationProps {
  decisions: DecisionData[];
  scores: {
    cooperation: number;
    caution: number;
    aggression: number;
  };
  context: string;
  onExport?: (chartType: string) => void;
}

const DataVisualizations = ({ decisions, scores, context, onExport }: VisualizationProps) => {
  const [activeChart, setActiveChart] = useState('overview');

  // Prepare data for different chart types
  const scoreData = [
    { name: 'Cooperation', value: scores.cooperation, color: '#10b981' },
    { name: 'Caution', value: scores.caution, color: '#f59e0b' },
    { name: 'Aggression', value: scores.aggression, color: '#ef4444' }
  ];

  const radialData = scoreData.map((item, index) => ({
    ...item,
    fill: item.color,
    cx: 150,
    cy: 150
  }));

  const timelineData = decisions.map((decision, index) => ({
    scenario: index + 1,
    cooperation: decision.cooperation,
    caution: decision.caution,
    aggression: decision.aggression,
    choice: decision.choice
  }));

  const decisionPatternData = decisions.reduce((acc: any[], decision) => {
    const existing = acc.find(item => item.choice === decision.choice);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ choice: decision.choice, count: 1 });
    }
    return acc;
  }, []);

  // Prevent division by zero for percentage calculations
  const totalDecisions = Math.max(1, decisions.length);

  // Heat map data for strategy analysis
  const heatMapData = [
    { x: 0, y: 0, strategy: 'Aggressive First Strike', frequency: decisions.filter(d => d.choice === 'attack').length, color: '#ef4444' },
    { x: 1, y: 0, strategy: 'Cautious Observation', frequency: decisions.filter(d => d.choice === 'silence').length, color: '#f59e0b' },
    { x: 2, y: 0, strategy: 'Cooperative Outreach', frequency: decisions.filter(d => d.choice === 'communicate').length, color: '#10b981' },
    { x: 0, y: 1, strategy: 'Information Gathering', frequency: Math.round(scores.caution / 10), color: '#8b5cf6' },
    { x: 1, y: 1, strategy: 'Risk Assessment', frequency: Math.round((scores.caution + scores.aggression) / 20), color: '#06b6d4' },
    { x: 2, y: 1, strategy: 'Trust Building', frequency: Math.round(scores.cooperation / 10), color: '#84cc16' }
  ];

  const maxFrequency = Math.max(1, ...heatMapData.map(d => d.frequency)); // Prevent division by zero

  // Decision tree data structure
  const decisionTreeData = {
    name: 'Dark Forest Scenario',
    children: [
      {
        name: 'Communicate',
        description: 'Reveal presence, seek cooperation',
        risk: 'High',
        children: [
          { name: 'Peaceful Response', outcome: 'Mutual benefit, knowledge sharing', probability: '30%' },
          { name: 'Hostile Response', outcome: 'Immediate threat, potential destruction', probability: '40%' },
          { name: 'No Response', outcome: 'Uncertainty, continued vulnerability', probability: '30%' }
        ]
      },
      {
        name: 'Maintain Silence',
        description: 'Observe while remaining hidden',
        risk: 'Medium',
        children: [
          { name: 'Gather Intelligence', outcome: 'Information advantage, strategic planning', probability: '60%' },
          { name: 'Missed Opportunities', outcome: 'Lost potential for cooperation', probability: '25%' },
          { name: 'Eventually Discovered', outcome: 'Reduced negotiating position', probability: '15%' }
        ]
      },
      {
        name: 'Preemptive Strike',
        description: 'Eliminate potential threat first',
        risk: 'Maximum',
        children: [
          { name: 'Successful Elimination', outcome: 'Threat removed, resources gained', probability: '45%' },
          { name: 'Failed Attack', outcome: 'Retaliation, escalated conflict', probability: '35%' },
          { name: 'Moral Consequences', outcome: 'Ethical burden, reputation damage', probability: '20%' }
        ]
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2" data-testid="title-data-visualizations">
          Strategic Analysis Dashboard
        </h2>
        <p className="text-muted-foreground" data-testid="text-analysis-subtitle">
          Visual analysis of your Dark Forest decision patterns in {context} context
        </p>
      </div>

      <Tabs value={activeChart} onValueChange={setActiveChart} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2" data-testid="tab-overview">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="patterns" className="flex items-center gap-2" data-testid="tab-patterns">
            <TrendingUp className="w-4 h-4" />
            Patterns
          </TabsTrigger>
          <TabsTrigger value="heatmap" className="flex items-center gap-2" data-testid="tab-heatmap">
            <Thermometer className="w-4 h-4" />
            Heat Map
          </TabsTrigger>
          <TabsTrigger value="tree" className="flex items-center gap-2" data-testid="tab-decision-tree">
            <TreePine className="w-4 h-4" />
            Decision Tree
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strategic Profile Pie Chart */}
            <Card data-testid="card-strategic-profile">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5" />
                  Strategic Profile Distribution
                </CardTitle>
                {onExport && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onExport('strategic-profile')}
                    data-testid="button-export-profile"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={scoreData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {scoreData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Radial Progress Chart */}
            <Card data-testid="card-radial-progress">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Strategic Intensity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="90%" data={radialData}>
                    <RadialBar dataKey="value" cornerRadius={10}>
                      {radialData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </RadialBar>
                    <Tooltip />
                    <Legend />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {scoreData.map((item, index) => (
                    <div key={index} className="text-center" data-testid={`score-${item.name.toLowerCase()}`}>
                      <div className="text-2xl font-bold" style={{ color: item.color }}>
                        {item.value}%
                      </div>
                      <div className="text-sm text-muted-foreground">{item.name}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Decision Pattern Summary */}
          <Card data-testid="card-decision-summary">
            <CardHeader>
              <CardTitle>Decision Pattern Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {decisionPatternData.map((pattern, index) => (
                  <div key={index} className="text-center p-4 border rounded-lg" data-testid={`pattern-${pattern.choice}`}>
                    <div className="text-lg font-semibold">
                      {pattern.choice === 'communicate' ? 'Communicate' : 
                       pattern.choice === 'silence' ? 'Maintain Silence' : 'Preemptive Strike'}
                    </div>
                    <div className="text-3xl font-bold mt-2">{pattern.count}</div>
                    <div className="text-sm text-muted-foreground">times chosen</div>
                    <Badge variant="outline" className="mt-2">
                      {Math.round((pattern.count / totalDecisions) * 100)}% of decisions
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          {/* Timeline Chart */}
          <Card data-testid="card-decision-timeline">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Decision Timeline Analysis
              </CardTitle>
              {onExport && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onExport('timeline')}
                  data-testid="button-export-timeline"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="scenario" />
                  <YAxis />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background border rounded-lg p-3 shadow-lg">
                            <p className="font-semibold">Scenario {label}</p>
                            <p className="text-sm">Choice: {data.choice}</p>
                            {payload.map((entry, index) => (
                              <p key={index} style={{ color: entry.color }}>
                                {entry.name}: {entry.value}
                              </p>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="cooperation" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="caution" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="aggression" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pattern Frequency Bar Chart */}
          <Card data-testid="card-pattern-frequency">
            <CardHeader>
              <CardTitle>Strategy Frequency Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={decisionPatternData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="choice" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="heatmap" className="space-y-6">
          <Card data-testid="card-strategy-heatmap">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="w-5 h-5" />
                Strategic Approach Heat Map
              </CardTitle>
              {onExport && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onExport('heatmap')}
                  data-testid="button-export-heatmap"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
                {heatMapData.map((cell, index) => (
                  <div
                    key={index}
                    className="aspect-square flex flex-col items-center justify-center text-center p-2 rounded-lg border"
                    style={{
                      backgroundColor: cell.color,
                      opacity: 0.3 + (cell.frequency / maxFrequency) * 0.7
                    }}
                    data-testid={`heatmap-cell-${index}`}
                  >
                    <div className="text-xs font-medium text-gray-800">{cell.strategy}</div>
                    <div className="text-lg font-bold text-gray-900">{cell.frequency}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Intensity indicates frequency of strategic approach usage
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tree" className="space-y-6">
          <Card data-testid="card-decision-tree">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Network className="w-5 h-5" />
                Decision Tree Analysis
              </CardTitle>
              {onExport && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onExport('decision-tree')}
                  data-testid="button-export-tree"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold">
                    {decisionTreeData.name}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {decisionTreeData.children.map((branch, index) => (
                    <div key={index} className="space-y-3" data-testid={`tree-branch-${index}`}>
                      <div className="text-center">
                        <div className={`inline-block px-3 py-2 rounded-lg font-medium ${
                          branch.risk === 'High' ? 'bg-red-100 text-red-800' :
                          branch.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          branch.risk === 'Maximum' ? 'bg-red-200 text-red-900' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {branch.name}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{branch.description}</p>
                        <Badge variant="outline" className="mt-1">{branch.risk} Risk</Badge>
                      </div>
                      
                      <div className="space-y-2">
                        {branch.children.map((outcome, outcomeIndex) => (
                          <div 
                            key={outcomeIndex} 
                            className="bg-muted/50 p-3 rounded border text-sm"
                            data-testid={`outcome-${index}-${outcomeIndex}`}
                          >
                            <div className="font-medium">{outcome.name}</div>
                            <div className="text-muted-foreground text-xs mt-1">{outcome.outcome}</div>
                            <div className="text-xs font-medium mt-1">Probability: {outcome.probability}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataVisualizations;