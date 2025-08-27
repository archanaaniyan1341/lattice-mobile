# Lattice Mobile 

A React Native + TypeScript app that brings Lattice's core experience to mobile with AI Conversation and Dashboard features.

## Features

### AI Conversation Page
- Swipeable sidebar with conversation threads
- Thread management (create, edit, delete with confirmation)
- Chat interface with message bubbles
- Simulated AI responses
- Markdown rendering in messages

### Dashboard
- Multiple dashboard management (create, switch, delete)
- Widget system with chart visualization
- Line charts with hardcoded datasets
- Mobile-optimized widget management

### Bonus Features
- Simulated streaming for AI responses
- Long press for repositioning widgets
- Markdown rendering in messages
- Multiple chart types (line, bar, pie)

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (optional)
- iOS Simulator (for iOS) or Android Studio (for Android)

### Installation
1. Clone the repository:
```bash
git clone <repository-url>
cd lattice-mobile
npm install
npx expo start
```

### Demo application
Please use the link to see demo of application
https://drive.google.com/drive/u/1/folders/12_1TSd3StvuMBVvfyk-8OO1V_uNjHEs-

### Component structure

```

                          ┌────────────────────┐
                          │      App.tsx       │
                          │  (Entry Point)     │
                          └─────────┬──────────┘
                                    │
                                    ▼
                          ┌────────────────────┐
                          │   AppNavigator     │
                          │ (Manages Screens)  │
                          └─────────┬──────────┘
                       ┌────────────┴────────────┐
                       ▼                         ▼
        ┌────────────────────────┐   ┌────────────────────────┐
        │   DashboardScreen       │   │      ChatScreen        │
        └───────────┬────────────┘   └──────────┬─────────────┘
                    │                           │
                    ▼                           ▼
        ┌──────────────────────┐     ┌──────────────────────┐
        │  DashboardContext    │     │     ChatContext      │
        │ (Global State Mgmt)  │     │ (Global State Mgmt)  │
        └───┬─────┬─────┬──────┘     └───┬─────┬─────┬──────┘
            │     │     │                │     │     │
            ▼     ▼     ▼                ▼     ▼     ▼
   ┌────────────┐ ┌───────────┐ ┌─────────────┐ ┌───────────────┐
   │DashboardHdr│ │WidgetGrid │ │ChartWidget  │ │  DropdownMenu │
   └────────────┘ └───────────┘ └─────────────┘ └───────────────┘

            ▼ (Reusable UI Layer) ▼
 ┌───────────────────────────────────────────┐
 │ Common Components:                        │
 │ ConfirmationModal, LongPressMenu,         │
 │ SafeAreaView, SwipeableRow                │
 └───────────────────────────────────────────┘

            ▼ (Underlying Data Layer) ▼
 ┌────────────────────┐     ┌─────────────────────┐
 │  mockChatData.ts   │     │ mockDashboardData.ts│
 │  (Sample Chat Data)│     │ (Sample Chart Data) │
 └────────────────────┘     └─────────────────────┘

            ▼ (Type Definitions) ▼
          ┌───────────────────┐
          │   types/index.ts  │
          │ (Shared Types)    │
          └───────────────────┘
```

### Feature Walkthrough
AI Conversation Module

    1. Conversation List Screen
    User Flow:
  
    User lands on conversation screen initially
    
    Sees past conversations by expanding sidebar
    
    Scrollable list of all past conversations
        
    "+" button to start new conversation
    
    UI Elements:
    
    Conversation cards showing: title, preview, timestamp
        
    New conversation FAB button
    
    Empty state illustration when no conversations
        
    2. Creating New Conversation
    User Flow:
    
    Tap "+" button → new conversation created
    
    Auto-generated title: "New Chat"
    
    Empty chat interface appears
    
    3. Chat Interface
    User Flow:
    
    Message input at bottom
    
    Send button (paper plane icon)
    
    Message bubbles with timestamps
    
    AI responses show typing indicators
    
    Scroll to bottom on new messages
    
    Features:
    
    Message Types: Text, code snippets, lists, tables
    
    AI Suggestions: Contextual quick replies
        
    Attachment Support: Images, documents (future)
    
    4. AI Interaction Patterns
    Response Types:
    
    Immediate acknowledgment for short queries
    
    Typing indicators for complex responses
    
    Progressive loading for long responses
    
    Follow-up questions for clarification
    
    Error States:(to be implemented later)
    
    Network timeout (30s)
    
    API rate limiting
    
    Content filtering triggers
    
    Maintenance windows
    
    5. Conversation Management
    User Actions:
    Select more option on each chat history in sidebar, dropdown appears to delete and rename conversation

 Dashboard Module
 
      1. Dashboard Overview
      User Flow:     
      Grid layout of widgets
      
      Long press for repositioning
      
      Add widget button at bottom
      
      Widget Types:
      
      Performance metrics charts
      
      2. Widget Management
      Adding Widgets:
      
      Tap "Add Widget" button
      
      Modal with widget type selection
      
      Configuration options per widget type(to be implemented)
      
      Preview before adding 
      
      Repositioning:
      
      Long press on widget 
      
      Move to desired position
      
      Visual feedback during drag
      
      Auto-snap to grid positions
      
      Removing Widgets:
      
      Delete icon on each widget
     
      
      3. Widget Types & Features
      A. Performance Metrics Widget
      
      Line/bar charts showing KPIs
      
      Date range selectors
      
      Comparison metrics
      
      Export to PDF option
      
     
      4. Dashboard Customization (to be implemented)
      Layout Options:
      
      Grid density (2 or 3 columns)
      
      Widget sizing (small, medium, large)
      
      Color themes (light/dark/system)
      
      Data refresh intervals
      
      Personalization:
      
      Frequently used widgets prioritized
      
      Smart suggestions based on role
      
      Department-specific defaults
      
      Manager vs. employee views

 Navigation & User Journey
  1. Primary Navigation
    Tab Bar:
    
    Dashboard
    Conversations (default)
    
    Secondary Navigation:
    
    Swipe gestures between tabs
    
    Deep linking to specific conversations
    
    Back button consistency
    
    Breadcrumb navigation for deep flows





