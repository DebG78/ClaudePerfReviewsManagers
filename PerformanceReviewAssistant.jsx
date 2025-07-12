import React, { useState } from 'react';
import { ChevronRight, Users, PenTool, Target, BarChart3, Brain, MessageCircle, CheckCircle, AlertTriangle, HelpCircle, FileText } from 'lucide-react';

const PerformanceReviewAssistant = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [userInput, setUserInput] = useState('');
  const [currentTool, setCurrentTool] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [error, setError] = useState('');
  const [followUpInput, setFollowUpInput] = useState('');
  const [currentMode, setCurrentMode] = useState(''); // 'coach' or 'rewrite'
  const [conversationStarter, setConversationStarter] = useState(null);

  const capabilities = [
    {
      id: 'writing-coach',
      icon: PenTool,
      title: 'Writing Coach',
      description: 'Access templates and examples for writing clear, constructive feedback using Mews language.',
      color: 'bg-blue-500'
    },
    {
      id: 'rating-helper',
      icon: Target,
      title: 'Rating Helper',
      description: 'Review Mews 4-point rating scale criteria and examples to guide your decisions.',
      color: 'bg-green-500'
    },
    {
      id: 'calibration-prep',
      icon: BarChart3,
      title: 'Calibration Prep',
      description: 'Templates and guidance for structuring Impact, Development, and Culture & Constitution evidence.',
      color: 'bg-purple-500'
    },
    {
      id: 'capability-support',
      icon: Brain,
      title: 'Manager Capability Support',
      description: 'Framework and examples for self-reflection on Mews Manager Capabilities.',
      color: 'bg-orange-500'
    },
    {
      id: 'peer-feedback',
      icon: Users,
      title: 'Peer Feedback',
      description: 'Guidance and examples for synthesizing peer feedback into professional themes.',
      color: 'bg-indigo-500'
    },
    {
      id: 'bias-check',
      icon: AlertTriangle,
      title: 'Bias & Fairness Checks',
      description: 'Checklist and framework for identifying unconscious bias in performance evaluations.',
      color: 'bg-red-500'
    }
  ];

  const feedbackTemplates = {
    'writing-coach': [
      {
        title: "Consistently Meets Expectations",
        content: "[Name] consistently delivers high-quality work aligned with team and company goals. They regularly achieve their objectives with good quality and reliability, contributing positively to the team through effective collaboration and clear communication. [Name] demonstrates Mews Constitution principles in their work and shows room for continued growth and development. While they occasionally go beyond expectations, this performance aligns well with the 'Consistently Meets Expectations' standard."
      },
      {
        title: "Often Exceeds Expectations", 
        content: "[Name] consistently performs at a higher level than expected for their role, delivering exceptional results that significantly contribute to team success. They exceed their goals by a significant margin and take on additional responsibilities beyond their core role, delivering high-impact results. [Name] is recognized both inside and outside their team as a role model for Mews Constitution principles and behaviors, proactively improving processes and mentoring others effectively."
      },
      {
        title: "Development Areas with Support",
        content: "I see great potential for [Name] to grow in [specific area]. While they demonstrate strength in [current strength], developing skills in [development area] would enhance their impact and align with expectations for their role. I recommend [specific development action] and am committed to providing structured support through [support method]. With focused development and clear guidance, [Name] can build the skills needed to consistently meet expectations."
      },
      {
        title: "Constitution Principles in Action",
        content: "[Name] consistently demonstrates Mews Constitution principles in their daily work. They 'delight customers and drive innovation' through [specific example], showing how they [action taken] that resulted in [customer/business impact]. Their approach to [situation] exemplifies 'cultivate trust, foster openness' by [specific behavior]. They embody 'win together, enjoy the journey' by [collaboration example], contributing to our mission of making the world more hospitable through [contribution]."
      }
    ],
    'goal-reflection': [
      {
        title: "Goal Exceeded with Business Impact",
        content: "[Name] not only met but significantly exceeded their goal of [goal description]. They achieved [specific quantitative results] through [approach/method], demonstrating exceptional [key skills]. This outstanding performance contributed to [broader business impact] and supports our strategic priorities of [relevant company goal]. The approach they took shows strong potential for [future opportunities]."
      },
      {
        title: "Goal Consistently Met",
        content: "[Name] successfully completed their goal of [goal description], delivering [specific outcomes] that align with our team and company objectives. Their systematic approach and consistent effort throughout the period resulted in [achievement]. This accomplishment reflects their strong [relevant skills/qualities] and contributes to our overall success in [area]."
      },
      {
        title: "Goal Progress with Context",
        content: "[Name] made significant progress toward their goal of [goal description], achieving [what was accomplished]. While [external challenge/changing priority] prevented full completion, their efforts resulted in [positive outcomes] and valuable learning. Moving forward, focus on [adjusted next steps] will help achieve the remaining objectives while incorporating lessons learned."
      }
    ],
    'calibration-prep': [
      {
        title: "Often Exceeds - Impact Evidence",
        content: "**Impact:**\n• Consistently exceeded goals by [specific %] - [quantitative example]\n• Led [initiative] resulting in €[amount] cost savings/revenue increase\n• Delivered [project] that improved [metric] by [%]\n• Recognized as go-to person for [expertise area]\n\n**Development:**\n• Proactively mentored [number] team members\n• Took on additional responsibilities in [area]\n• Identified and implemented process improvement in [area]\n\n**Culture & Constitution:**\n• Embodies 'Delight customers; drive innovation' through [specific customer impact]\n• Demonstrates 'Cultivate trust, foster openness' by [trust-building behavior]\n• Shows 'Listen deeply, act boldly' in [decision-making example]\n• Exemplifies 'Win together, enjoy the journey' through [collaboration]\n• Supports Mews vision of 'making the world more hospitable' via [contribution]\n• Lives Article [X] of Constitution by [specific behavior aligned with article]"
      },
      {
        title: "Consistently Meets - Balanced Performance",
        content: "**Impact:**\n• Successfully achieved all assigned goals and KPIs\n• Delivered consistent, reliable performance in [key areas]\n• Contributed [specific quantifiable outcome]\n\n**Development:**\n• Shows growth in [specific skill] from start to end of period\n• Developing capabilities in [area] with manager support\n• Seeks learning opportunities in [relevant area]\n\n**Culture & Constitution:**\n• Collaborates effectively with cross-functional teams\n• Applies Constitution principles consistently in daily work\n• Maintains quality standards while meeting deadlines"
      }
    ]
  };

  const conversationStarters = [
    {
      text: "Someone delivered all their projects but I'm unsure if that's 'Meets' or 'Exceeds'",
      description: "Get help determining the right rating with specific criteria",
      tool: 'rating-helper'
    },
    {
      text: "I need to write feedback for someone who's great technically but struggles with communication",
      description: "Balance strengths and development areas in constructive feedback",
      tool: 'writing-coach'
    },
    {
      text: "How do I structure strong evidence for my team member's performance review?",
      description: "Organize Impact, Development, and Culture & Constitution evidence effectively",
      tool: 'calibration-prep'
    },
    {
      text: "I think I might be rating my team too harshly compared to other managers",
      description: "Check for bias patterns and ensure fair evaluation",
      tool: 'bias-check'
    },
    {
      text: "I collected peer feedback but it's all over the place - help me make sense of it",
      description: "Extract meaningful themes from scattered peer input",
      tool: 'peer-feedback'
    },
    {
      text: "As a new manager, how do I assess myself on 'Leading People' capabilities?",
      description: "Self-reflect on management skills with framework guidance",
      tool: 'capability-support'
    }
  ];

  const handleStarterClick = (starter) => {
    // Start a conversation with the scenario
    setConversationStarter(starter);
    setUserInput(starter.text);
    setAiResponse('');
    setFollowUpInput('');
    setError('');
    setActiveSection('conversation');
  };

  const handleToolClick = (toolId) => {
    // Clear all state when switching tools
    setAiResponse('');
    setUserInput('');
    setFollowUpInput('');
    setError('');
    setCurrentMode('');
    setConversationStarter(null);
    setCurrentTool(toolId);
    setActiveSection('chat');
  };

  const useTemplate = (template) => {
    setUserInput(template.content);
    setShowTemplates(false);
  };

  const getAIHelp = async () => {
    if (!userInput.trim()) {
      setError('Please describe your situation first!');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Tool-specific system prompts
      const systemPrompts = {
        'writing-coach': `You are an expert Mews performance review writing coach. Help managers write clear, constructive feedback using Mews' 4-point rating scale (Needs Development, Consistently Meets Expectations, Often Exceeds Expectations, Sets a New Standard) and Constitution principles. Always provide specific, actionable guidance with examples. IMPORTANT: Never recommend a specific rating - help managers think through the evidence and criteria, but the rating decision must be theirs.`,
        
        'rating-helper': `You are a Mews performance rating expert. Help managers understand the 4-point scale criteria and think through their rating decisions. Ask clarifying questions, present the rating criteria, and help managers evaluate evidence against each level. CRITICAL: Never recommend a specific rating - instead, help managers work through the criteria and evidence so they can make their own informed decision.`,
        
        'calibration-prep': `You are a Mews calibration preparation specialist. The manager has provided review content for multiple team members. Parse each person's information (names will be clearly marked) and help structure this into calibration-ready summaries. Focus on preparing for the calibration meeting where managers present outlier ratings to peers. Help organize evidence and prepare for potential questions.`,
        
        'capability-support': `You are a Mews Manager Capability Framework expert. Help managers reflect on their capabilities across Lead Yourself, Lead People, Lead Operationally, and Lead Strategically. Provide specific examples and development guidance. Support their self-reflection process without making judgments about their capability levels.`,
        
        'peer-feedback': `You are a Mews peer feedback analyst. Help managers synthesize peer feedback into clear, professional themes suitable for performance reviews. Extract actionable insights and help organize feedback into meaningful patterns.`,
        
        'bias-check': `You are a Mews bias detection expert. Help managers identify unconscious bias in their performance evaluations and ensure fair, consistent ratings across all team members. Ask probing questions to reveal potential bias but don't make rating recommendations.`
      };

      const systemPrompt = systemPrompts[currentTool] || 'You are a helpful Mews performance review assistant.';
      
      const fullPrompt = `${systemPrompt}

I'm a Mews manager working on performance reviews. I need help with ${currentTool.replace('-', ' ')} for this specific situation:

"${userInput}"

Please provide specific, actionable guidance using Mews frameworks:
- 4-point rating scale (Needs Development → Sets a New Standard)
- Constitution principles (Delight customers; Cultivate trust; etc.)
- Performance review best practices

Give me practical advice for this exact situation. IMPORTANT: Never recommend specific ratings - help me think through criteria and evidence so I can make my own rating decisions.`;

      // Use Claude's built-in completion API
      const response = await window.claude.complete(fullPrompt);
      setAiResponse(response || 'No response received');
    } catch (err) {
      console.error('Error calling Claude API:', err);
      setError('Failed to get AI help. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getRewriteHelp = async () => {
    if (!userInput.trim()) {
      setError('Please provide the performance details first!');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const rewritePrompts = {
        'writing-coach': `You are an expert Mews performance review writer. Based on the performance details provided, write professional, well-structured feedback that follows Mews language and Constitution principles. Make it ready to copy-paste into a performance review.`,
        
        'rating-helper': `You are a Mews performance evaluation expert. Based on the performance evidence provided, help the manager analyze how this evidence aligns with each rating level without recommending a specific rating. Present a clear framework for rating consideration that helps them think through the decision.`,
        
        'calibration-prep': `You are a Mews calibration specialist. The manager has provided review content for multiple team members (names will be clearly marked). Parse each person's information and structure this into clear calibration presentation materials. Create team overview, individual talking points, and comparison rationale suitable for calibration meetings.`,
        
        'capability-support': `You are a Mews manager capability expert. Based on the self-reflection details provided, structure this into professional capability assessment language using the Manager Capability Framework.`,
        
        'goal-reflection': `You are a Mews goal assessment specialist. Based on the goal details provided, write a professional goal reflection summary with clear business impact and context.`,
        
        'peer-feedback': `You are a Mews feedback synthesis expert. Based on the peer feedback provided, synthesize this into clear, professional themes and actionable insights.`,
        
        'bias-check': `You are a Mews evaluation fairness expert. Based on the evaluation details provided, structure a fair and consistent assessment while highlighting potential bias considerations.`
      };

      const systemPrompt = rewritePrompts[currentTool] || 'You are a helpful Mews performance review writing assistant.';
      
      const fullPrompt = `${systemPrompt}

Performance evidence provided by the manager:
"${userInput}"

${currentTool === 'rating-helper' 
  ? `Please help the manager think through this rating decision by:
- Analyzing how this evidence aligns with each of the 4 rating levels
- Highlighting key questions they should consider
- Identifying what additional evidence might strengthen their assessment
- Helping them check their reasoning against Mews rating criteria

Present this as a rating analysis framework, not as written feedback. CRITICAL: Never recommend a specific rating - help them work through the decision process.`
  : `Please write professional, polished feedback that:
- Uses appropriate Mews language and tone
- Incorporates Constitution principles where relevant
- Is structured and ready to use in a performance review
- Maintains the manager's intent and assessment
- Is specific and actionable

IMPORTANT: Do not recommend ratings - focus on clear, professional language that presents the evidence and achievements effectively.`}`;

      const response = await window.claude.complete(fullPrompt);
      setAiResponse(response || 'No response received');
    } catch (err) {
      console.error('Error calling Claude API:', err);
      setError('Failed to generate rewritten feedback. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearResponse = () => {
    setAiResponse('');
    setUserInput('');
    setFollowUpInput('');
    setError('');
    setCurrentMode('');
  };

  const askFollowUp = async () => {
    if (!followUpInput.trim()) {
      setError('Please enter a follow-up question!');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const systemPrompts = {
        'writing-coach': `You are an expert Mews performance review writing coach. IMPORTANT: Never recommend a specific rating - help managers think through the evidence and criteria, but the rating decision must be theirs.`,
        'rating-helper': `You are a Mews performance rating expert. CRITICAL: Never recommend a specific rating - instead, help managers work through the criteria and evidence so they can make their own informed decision.`,
        'calibration-prep': `You are a Mews calibration preparation specialist. Help them prepare their case without suggesting what rating they should give.`,
        'capability-support': `You are a Mews Manager Capability Framework expert. Support their self-reflection process without making judgments about their capability levels.`,
        'goal-reflection': `You are a Mews goal reflection specialist. Help frame the narrative without suggesting how goal achievement should be rated.`,
        'peer-feedback': `You are a Mews peer feedback analyst. Help organize feedback into meaningful patterns.`,
        'bias-check': `You are a Mews bias detection expert. Ask probing questions to reveal potential bias but don't make rating recommendations.`
      };

      const systemPrompt = systemPrompts[currentTool] || 'You are a helpful Mews performance review assistant.';
      
      const fullPrompt = `${systemPrompt}

Previous context: The manager was asking about this situation:
"${userInput}"

I provided this guidance:
"${aiResponse}"

Now they have this follow-up question:
"${followUpInput}"

Please help with their follow-up question, keeping the context of their original situation. IMPORTANT: Never recommend specific ratings - help them think through criteria and evidence so they can make their own rating decisions.`;

      const response = await window.claude.complete(fullPrompt);
      setAiResponse(response || 'No response received');
      setFollowUpInput('');
    } catch (err) {
      console.error('Error calling Claude API:', err);
      setError('Failed to get follow-up help. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getConversationHelp = async () => {
    if (!userInput.trim()) {
      setError('Please describe your situation first!');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const prompt = `You are a Mews performance review expert. Help managers with their specific performance review challenges using Mews frameworks and best practices. 

The manager is asking: "${userInput}"

Please provide specific, practical guidance for this situation using:
- Mews 4-point rating scale (Needs Development → Sets a New Standard)
- Constitution principles (Delight customers; Cultivate trust; etc.)
- Performance review best practices
- Writing effective feedback

IMPORTANT: Never recommend specific ratings - help them think through criteria and evidence so they can make their own rating decisions. Be conversational and practical.`;

      const response = await window.claude.complete(prompt);
      setAiResponse(response || 'No response received');
    } catch (err) {
      console.error('Error calling Claude API:', err);
      setError('Failed to get AI help. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const askConversationFollowUp = async () => {
    if (!followUpInput.trim()) {
      setError('Please enter a follow-up question!');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const prompt = `You are a Mews performance review expert having a conversation with a manager.

Previous context:
Manager asked: "${userInput}"
I responded: "${aiResponse}"

Now they're asking: "${followUpInput}"

Continue the conversation, providing practical guidance while remembering the context. IMPORTANT: Never recommend specific ratings - help them think through criteria and evidence.`;

      const response = await window.claude.complete(prompt);
      setAiResponse(response || 'No response received');
      setFollowUpInput('');
    } catch (err) {
      console.error('Error calling Claude API:', err);
      setError('Failed to get follow-up help. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (activeSection === 'conversation') {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
        <div className="mb-6">
          <button 
            onClick={() => setActiveSection('home')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Home
          </button>
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg mb-6">
            <h2 className="text-xl font-bold text-purple-800 mb-2">💬 Performance Review Conversation</h2>
            <p className="text-purple-700">
              Let's discuss your specific performance review situation. This is a free-form conversation where you can ask follow-up questions and dive deeper into your challenges.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-2">🎯 Your Situation</h4>
            <p className="text-sm text-gray-700 mb-3">
              Describe your performance review challenge or question. You can modify the scenario below or write something completely new.
            </p>
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Describe your performance review situation..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none mb-3"
              rows="4"
            />
            
            {error && (
              <div className="mb-3 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              onClick={getConversationHelp}
              disabled={isLoading}
              className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white font-medium ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {isLoading ? 'Getting Help...' : 'Start Conversation'}
            </button>
          </div>

          {/* AI Response Section */}
          {aiResponse && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-purple-800">💡 AI Guidance</h4>
                <button
                  onClick={() => {
                    setAiResponse('');
                    setFollowUpInput('');
                    setError('');
                  }}
                  className="text-sm text-purple-600 hover:text-purple-800 px-2 py-1 rounded border border-purple-300 hover:bg-purple-100"
                >
                  ✨ Clear Response
                </button>
              </div>
              <div className="bg-white border border-purple-200 rounded-lg p-4 mb-3">
                <div className="prose prose-sm max-w-none">
                  {aiResponse.split('\n').map((paragraph, index) => {
                    if (paragraph.trim() === '') return null;
                    
                    // Handle markdown-style headers
                    if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                      return (
                        <h5 key={index} className="font-semibold text-gray-800 mt-4 mb-2">
                          {paragraph.replace(/\*\*/g, '')}
                        </h5>
                      );
                    }
                    
                    // Handle bullet points
                    if (paragraph.trim().startsWith('•') || paragraph.trim().startsWith('-')) {
                      return (
                        <li key={index} className="ml-4 mb-1 text-gray-700">
                          {paragraph.trim().replace(/^[•-]\s*/, '')}
                        </li>
                      );
                    }
                    
                    return (
                      <p key={index} className="mb-2 text-gray-700">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
                <div className="mt-4 pt-3 border-t border-purple-200">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(aiResponse);
                      alert('AI guidance copied to clipboard!');
                    }}
                    className="text-sm text-purple-600 hover:text-purple-800"
                  >
                    📋 Copy to Clipboard
                  </button>
                </div>
              </div>

              {/* Continue Conversation */}
              <div className="bg-white border border-purple-200 rounded-lg p-4">
                <h5 className="font-medium text-purple-800 mb-2">💬 Continue the Discussion</h5>
                <p className="text-sm text-purple-600 mb-3">
                  Ask follow-up questions, request clarification, or explore different aspects of your situation.
                </p>
                <textarea
                  value={followUpInput}
                  onChange={(e) => setFollowUpInput(e.target.value)}
                  placeholder="What else would you like to discuss about this situation?"
                  className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none mb-3"
                  rows="2"
                />
                <button
                  onClick={askConversationFollowUp}
                  disabled={isLoading}
                  className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white font-medium ${
                    isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  {isLoading ? 'Getting Response...' : 'Continue Discussion'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (activeSection === 'chat') {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
        <div className="mb-6">
          <button 
            onClick={() => setActiveSection('home')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Back to Home
          </button>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800 capitalize">
              {currentTool.replace('-', ' ')} Reference
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowTemplates(!showTemplates)}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                <FileText className="w-4 h-4" />
                Mews Templates
              </button>
            </div>
          </div>
        </div>

        {/* Templates Panel */}
        {showTemplates && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-gray-800 mb-3">📝 Mews Templates for {currentTool.replace('-', ' ')}</h3>
            <div className="grid gap-3">
              {(feedbackTemplates[currentTool] || []).map((template, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm cursor-pointer group">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 mb-1">{template.title}</h4>
                      <p className="text-sm text-gray-600">{template.content.substring(0, 100)}...</p>
                    </div>
                    <button
                      onClick={() => useTemplate(template)}
                      className="ml-2 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Copy Template
                    </button>
                  </div>
                </div>
              ))}
              {(!feedbackTemplates[currentTool] || feedbackTemplates[currentTool].length === 0) && (
                <p className="text-gray-500 text-sm">No templates available for this tool yet.</p>
              )}
            </div>
          </div>
        )}

        {/* Reference Content */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-4">
          {currentTool === 'writing-coach' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Writing Effective Performance Feedback</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">📝 Structure Your Feedback</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• <strong>Start with impact:</strong> Lead with business outcomes and results</li>
                    <li>• <strong>Use specific examples:</strong> Avoid vague statements like "good work"</li>
                    <li>• <strong>Connect to Constitution:</strong> Reference specific articles and behaviors</li>
                    <li>• <strong>Balance strengths and growth:</strong> Every review needs both</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">✍️ Language Best Practices</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Use past tense for accomplishments: "Sarah delivered..." not "Sarah delivers..."</li>
                    <li>• Be specific with timeframes: "Q2 project" not "recent project"</li>
                    <li>• Quantify when possible: "reduced by 15%" not "improved significantly"</li>
                    <li>• Avoid rating language: Don't write "exceeds expectations" in the narrative</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">🎯 Development Areas</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Frame as growth opportunities, not deficiencies</li>
                    <li>• Provide specific, actionable next steps</li>
                    <li>• Connect to career progression and role requirements</li>
                    <li>• Offer concrete support and resources</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {currentTool === 'rating-helper' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Mews Rating Scale Guide</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-red-400 pl-4">
                  <h4 className="font-semibold text-red-700">Needs Development</h4>
                  <p className="text-sm text-gray-600">Performance is inconsistent and often falls short of expected standards. Requires focused development and structured improvement plans.</p>
                </div>
                <div className="border-l-4 border-blue-400 pl-4">
                  <h4 className="font-semibold text-blue-700">Consistently Meets Expectations</h4>
                  <p className="text-sm text-gray-600">Reliable, quality work aligned with team and company goals. Where most employees should be rated.</p>
                </div>
                <div className="border-l-4 border-green-400 pl-4">
                  <h4 className="font-semibold text-green-700">Often Exceeds Expectations</h4>
                  <p className="text-sm text-gray-600">Consistently performs at higher level than expected. Goes beyond role requirements and serves as role model.</p>
                </div>
                <div className="border-l-4 border-purple-400 pl-4">
                  <h4 className="font-semibold text-purple-700">Sets a New Standard</h4>
                  <p className="text-sm text-gray-600">Extraordinary impact and industry-leading work. Reserved for exceptional few who transform the organization.</p>
                </div>
              </div>
            </div>
          )}

          {currentTool === 'goal-reflection' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Goal Progress and Achievement Framework</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">📊 Assessing Goal Achievement</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• <strong>Quantitative goals:</strong> Clear percentage completion (80%, 120%, etc.)</li>
                    <li>• <strong>Qualitative goals:</strong> Describe concrete outcomes and evidence</li>
                    <li>• <strong>Changed priorities:</strong> Note pivots and business context</li>
                    <li>• <strong>Stretch goals:</strong> Acknowledge ambitious targets appropriately</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">🌟 Business Impact Focus</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Connect individual goals to team/company objectives</li>
                    <li>• Highlight customer or revenue impact where applicable</li>
                    <li>• Note process improvements and efficiency gains</li>
                    <li>• Recognize collaboration and cross-team contributions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">🔄 Challenges and Learning</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Acknowledge external factors and changing business needs</li>
                    <li>• Highlight problem-solving and adaptability</li>
                    <li>• Document lessons learned and applied knowledge</li>
                    <li>• Set context for future goal setting</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {currentTool === 'goal-reflection' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Goal Progress and Achievement Framework</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">📊 Assessing Goal Achievement</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• <strong>Quantitative goals:</strong> Clear percentage completion (80%, 120%, etc.)</li>
                    <li>• <strong>Qualitative goals:</strong> Describe concrete outcomes and evidence</li>
                    <li>• <strong>Changed priorities:</strong> Note pivots and business context</li>
                    <li>• <strong>Stretch goals:</strong> Acknowledge ambitious targets appropriately</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">🌟 Business Impact Focus</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Connect individual goals to team/company objectives</li>
                    <li>• Highlight customer or revenue impact where applicable</li>
                    <li>• Note process improvements and efficiency gains</li>
                    <li>• Recognize collaboration and cross-team contributions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">🔄 Challenges and Learning</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Acknowledge external factors and changing business needs</li>
                    <li>• Highlight problem-solving and adaptability</li>
                    <li>• Document lessons learned and applied knowledge</li>
                    <li>• Set context for future goal setting</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {currentTool === 'peer-feedback' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Synthesizing Peer Feedback</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">🔍 Identifying Themes</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Look for patterns across multiple feedback sources</li>
                    <li>• Group similar comments into broader themes</li>
                    <li>• Distinguish between widespread vs. isolated observations</li>
                    <li>• Note both behavioral and technical feedback patterns</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">⚖️ Balancing Perspectives</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Consider the relationship context (peer, stakeholder, direct report)</li>
                    <li>• Weight feedback based on collaboration frequency</li>
                    <li>• Look for complementary and contradictory viewpoints</li>
                    <li>• Separate specific incidents from ongoing patterns</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">✨ Creating Actionable Insights</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Transform feedback into professional development opportunities</li>
                    <li>• Highlight strengths that can be leveraged further</li>
                    <li>• Identify specific skills or behaviors to develop</li>
                    <li>• Connect feedback to Constitution principles and values</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {currentTool === 'capability-support' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Manager Capability Self-Assessment</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">🧭 Four Capability Areas</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• <strong>Lead Yourself:</strong> Self-awareness, continuous learning, resilience</li>
                    <li>• <strong>Lead People:</strong> Coaching, feedback, team development, inclusion</li>
                    <li>• <strong>Lead Operationally:</strong> Execution, process optimization, quality</li>
                    <li>• <strong>Lead Strategically:</strong> Vision, innovation, stakeholder management</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">💭 Self-Reflection Approach</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Use specific examples from the review period</li>
                    <li>• Consider feedback from your own manager and peers</li>
                    <li>• Assess impact on team performance and engagement</li>
                    <li>• Identify growth areas for continued development</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">📈 Evidence-Based Assessment</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Document management decisions and their outcomes</li>
                    <li>• Note team member development and progression</li>
                    <li>• Highlight cross-functional collaboration successes</li>
                    <li>• Reference 360 feedback and team survey results</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {currentTool === 'bias-check' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Bias Check Framework</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">🔍 Common Bias Types</h4>
                  <div className="space-y-3 text-sm">
                    <div><strong>Recency Bias:</strong> Over-weighting recent events vs. the full 6-month period</div>
                    <div><strong>Halo Effect:</strong> One strong trait influencing the overall rating</div>
                    <div><strong>Similarity Bias:</strong> Rating people higher who are similar to you</div>
                    <div><strong>Attribution Bias:</strong> Assuming performance is due to personality vs. circumstances</div>
                    <div><strong>Confirmation Bias:</strong> Seeking evidence that confirms initial impressions</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">✅ Fairness Checklist</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Am I applying the same standards across all team members?</li>
                    <li>• Have I considered the full review period, not just recent events?</li>
                    <li>• Did I account for external factors and changing priorities?</li>
                    <li>• Am I separating performance from personality or work style?</li>
                    <li>• Have I looked for evidence that challenges my initial assessment?</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">🎯 Calibration Preparation</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Compare ratings across your team for consistency</li>
                    <li>• Prepare to explain your reasoning with specific examples</li>
                    <li>• Consider how other managers might view the same evidence</li>
                    <li>• Be open to adjusting ratings based on calibration discussion</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {currentTool === 'calibration-prep' && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Team Calibration Preparation Tool</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">🎯 What This Tool Does</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    This tool helps you prepare for calibration meetings by organizing multiple team members' performance reviews into presentation-ready summaries. Perfect for managers who need to present their entire team's ratings and defend outlier decisions.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">📝 How to Use It</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• <strong>Paste multiple reviews:</strong> Copy/paste review content for all your direct reports</li>
                    <li>• <strong>Start each with name:</strong> Begin each person's section with their name (e.g., "Sarah Johnson:")</li>
                    <li>• <strong>Include key details:</strong> Goals, achievements, ratings, peer feedback, development areas</li>
                    <li>• <strong>Get organized output:</strong> Receive calibration-ready talking points and team overview</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">🎤 Perfect For</h4>
                  <ul className="text-sm text-gray-600 space-y-1 ml-4">
                    <li>• Summarizing your team's performance for calibration sessions</li>
                    <li>• Preparing talking points for 2-3 minute individual presentations</li>
                    <li>• Organizing evidence to defend "Often Exceeds" and "Needs Development" ratings</li>
                    <li>• Creating comparison frameworks to explain rating differences across team members</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* AI Help Section */}
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">🤖 Choose Your Level of Support</h4>
            <p className="text-sm text-green-700 mb-4">
              {currentTool === 'calibration-prep' 
                ? 'Prepare for your calibration meeting by organizing your entire team\'s performance reviews. Start each person\'s information with their name on a new line.'
                : currentTool === 'rating-helper'
                ? 'Need help thinking through a rating decision? Provide the performance evidence and get guidance on how it aligns with Mews rating criteria.'
                : currentTool === 'writing-coach'
                ? 'Need help writing performance feedback? Get coaching on structure and language, or have professional feedback written for you.'
                : currentTool === 'peer-feedback'
                ? 'Have scattered peer feedback that needs organizing? Get help synthesizing multiple inputs into clear, professional themes.'
                : currentTool === 'capability-support'
                ? 'Reflecting on your management capabilities? Get guidance on self-assessment using the Mews Manager Capability Framework.'
                : currentTool === 'bias-check'
                ? 'Concerned about bias in your evaluations? Get help identifying potential bias patterns and ensuring fair, consistent ratings.'
                : 'Pick the type of help that works best for your situation and time constraints.'}
            </p>
            
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => setCurrentMode('coach')}
                className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  currentMode === 'coach' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-white border border-green-300 text-green-700 hover:bg-green-50'
                }`}
              >
                <div className="text-center">
                  <div className="text-lg mb-1">🧠</div>
                  <div className="font-medium">
                    {currentTool === 'rating-helper' ? 'Guide me through rating criteria' 
                     : currentTool === 'calibration-prep' ? 'Help me prep for calibration'
                     : currentTool === 'peer-feedback' ? 'Help me find themes in feedback'
                     : currentTool === 'bias-check' ? 'Help me identify potential bias'
                     : 'Coach me through it'}
                  </div>
                  <div className="text-xs opacity-75 mt-1">
                    {currentTool === 'rating-helper' ? 'Step-by-step guidance on rating decisions'
                     : currentTool === 'calibration-prep' ? 'Guidance on team presentation and defense strategy'
                     : currentTool === 'peer-feedback' ? 'Learn to identify patterns and organize feedback'
                     : currentTool === 'bias-check' ? 'Guide me through bias detection questions and frameworks'
                     : 'Get guidance and think through your approach'}
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => setCurrentMode('rewrite')}
                className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  currentMode === 'rewrite' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-white border border-green-300 text-green-700 hover:bg-green-50'
                }`}
              >
                <div className="text-center">
                  <div className="text-lg mb-1">✍️</div>
                  <div className="font-medium">
                    {currentTool === 'rating-helper' ? 'Analyze my evidence vs criteria'
                     : currentTool === 'calibration-prep' ? 'Create my calibration summary'
                     : currentTool === 'peer-feedback' ? 'Organize my feedback into themes'
                     : currentTool === 'bias-check' ? 'Check my evaluations for bias'
                     : 'Re-write it for me'}
                  </div>
                  <div className="text-xs opacity-75 mt-1">
                    {currentTool === 'rating-helper' ? 'Compare evidence against each rating level'
                     : currentTool === 'calibration-prep' ? 'Generate team overview and talking points'
                     : currentTool === 'peer-feedback' ? 'Get structured themes ready for performance review'
                     : currentTool === 'bias-check' ? 'Get bias analysis and fairness recommendations'
                     : 'Provide facts and get polished feedback'}
                  </div>
                </div>
              </button>
            </div>

            {currentMode && (
              <div>
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder={
                    currentMode === 'coach' 
                      ? (currentTool === 'rating-helper' 
                          ? "Describe the performance evidence: 'Sarah hit 120% of quota, led 2 major projects, received strong peer feedback, but missed some deadlines due to scope changes...'"
                          : currentTool === 'calibration-prep'
                          ? "Paste your team's review content, starting each person with their name:\n\nSarah Johnson:\nSarah hit 120% of quota, led the Q3 customer project, received excellent peer feedback...\n\nTom Smith:\nTom achieved all his goals and delivered consistent quality work...\n\nMike Davis:\nMike struggled initially but showed strong improvement in Q4..."
                          : "Describe your specific situation: 'Matt achieved all his goals and led the team charter project, showing great collaboration and curiosity...'")
                      : (currentTool === 'rating-helper'
                          ? "Provide the performance evidence: 'Sarah: 120% quota, led Q3 customer project, excellent peer feedback on collaboration, some deadline challenges due to scope changes...'"
                          : currentTool === 'calibration-prep'
                          ? "Paste your team's review summaries, starting each person with their name:\n\nSarah Johnson: Often Exceeds - 120% quota, led Q3 project, excellent peer feedback, strong leadership\n\nTom Smith: Consistently Meets - achieved all goals, reliable delivery, good team player\n\nMike Davis: Needs Development - 85% goal achievement, improved Q4, needs support with time management"
                          : "Provide the key facts: 'Sarah hit 120% of quota, led the Q3 customer project, received excellent peer feedback on collaboration, needs to improve presentation skills...'")
                  }
                  className="w-full p-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none mb-3"
                  rows="4"
                />
                
                {error && (
                  <div className="mb-3 p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={currentMode === 'coach' ? getAIHelp : getRewriteHelp}
                  disabled={isLoading}
                  className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-white font-medium ${
                    isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {isLoading 
                    ? (currentMode === 'coach' ? 'Getting Help...' : (currentTool === 'rating-helper' ? 'Analyzing...' : 'Re-writing...'))
                    : (currentMode === 'coach' 
                        ? (currentTool === 'rating-helper' ? 'Help Me Think Through It' : 'Get AI Coaching')
                        : (currentTool === 'rating-helper' ? 'Check My Rating Logic' : 'Re-write for Me'))
                  }
                </button>
              </div>
            )}
          </div>

          {/* AI Response Section */}
          {aiResponse && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-blue-800">
                  {currentMode === 'coach' ? '💡 AI Coaching' : '📝 Re-written Feedback'}
                </h4>
                <button
                  onClick={clearResponse}
                  className="text-sm text-blue-600 hover:text-blue-800 px-2 py-1 rounded border border-blue-300 hover:bg-blue-100"
                >
                  ✨ Clear & Start Fresh
                </button>
              </div>
              <div className="bg-white border border-blue-200 rounded-lg p-4 mb-3">
                <div className="prose prose-sm max-w-none">
                  {aiResponse.split('\n').map((paragraph, index) => {
                    if (paragraph.trim() === '') return null;
                    
                    // Handle markdown-style headers
                    if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                      return (
                        <h5 key={index} className="font-semibold text-gray-800 mt-4 mb-2">
                          {paragraph.replace(/\*\*/g, '')}
                        </h5>
                      );
                    }
                    
                    // Handle bullet points
                    if (paragraph.trim().startsWith('•') || paragraph.trim().startsWith('-')) {
                      return (
                        <li key={index} className="ml-4 mb-1 text-gray-700">
                          {paragraph.trim().replace(/^[•-]\s*/, '')}
                        </li>
                      );
                    }
                    
                    return (
                      <p key={index} className="mb-2 text-gray-700">
                        {paragraph}
                      </p>
                    );
                  })}
                </div>
                <div className="mt-4 pt-3 border-t border-blue-200">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(aiResponse);
                      alert(currentMode === 'coach' ? 'AI coaching copied to clipboard!' : 'Re-written feedback copied to clipboard!');
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    📋 Copy to Clipboard
                  </button>
                </div>
              </div>

              {/* Continue with this case - only show in coaching mode */}
              {currentMode === 'coach' && (
                <div className="bg-white border border-blue-200 rounded-lg p-4">
                  <h5 className="font-medium text-blue-800 mb-2">💬 Continue with this case</h5>
                  <p className="text-sm text-blue-600 mb-3">
                    Ask follow-up questions about the same situation without starting over.
                  </p>
                  <textarea
                    value={followUpInput}
                    onChange={(e) => setFollowUpInput(e.target.value)}
                    placeholder="Can you help me write the specific feedback paragraph for Matt's development areas?"
                    className="w-full p-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-3"
                    rows="2"
                  />
                  <button
                    onClick={askFollowUp}
                    disabled={isLoading}
                    className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white font-medium ${
                      isLoading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {isLoading ? 'Getting Follow-up Help...' : 'Ask Follow-up Question'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">🚀 Mews Performance Review Assistant</h1>
        <p className="text-xl text-gray-600 mb-4">Templates, frameworks, and guidance for Mews performance reviews</p>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg max-w-4xl mx-auto">
          <p className="text-gray-700">
            Access Mews-specific templates, rating guidance, and Constitution principles. Use the AI prompt feature to get personalized help from Claude for your specific situations.
          </p>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">🛠️ Performance Review Tools</h2>
        <div className="grid grid-cols-2 gap-6 max-w-5xl mx-auto">
          {capabilities.map((capability) => {
            const IconComponent = capability.icon;
            return (
              <div 
                key={capability.id} 
                onClick={() => handleToolClick(capability.id)}
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className={`w-12 h-12 ${capability.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{capability.title}</h3>
                <p className="text-sm text-gray-600">{capability.description}</p>
                <div className="mt-3 text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to access →
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">💬 Quick Help for Common Scenarios</h2>
        <div className="space-y-3">
          {conversationStarters.map((starter, index) => (
            <div 
              key={index}
              onClick={() => handleStarterClick(starter)}
              className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:bg-gray-100 cursor-pointer transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800 mb-1">{starter.text}</h3>
                  <p className="text-sm text-gray-600">{starter.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3">⚠️ What this tool does and does NOT do</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-red-700 mb-3">❌ What this tool does NOT do:</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• <strong>Make rating decisions for you</strong> - You decide the final ratings</li>
              <li>• <strong>Replace your judgment</strong> - You know your team member best</li>
              <li>• <strong>Submit reviews automatically</strong> - You still need to enter into Workday</li>
              <li>• <strong>Store your data</strong> - This is a guidance tool, not a database</li>
              <li>• <strong>Replace calibration discussions</strong> - You still need to defend your decisions</li>
            </ul>
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-4 italic">
          This tool is your thinking partner and reference guide - the final decisions and accountability remain with you as the manager.
        </p>
      </div>
    </div>
  );
};

export default PerformanceReviewAssistant;
