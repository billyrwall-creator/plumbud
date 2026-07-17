# PlumbBud Product Requirements Document

## 1. Overview

PlumbBud is an evidence-based AI assistant designed for UK plumbing, heating and Gas Safe engineers. The product will help professionals access reliable technical guidance by combining official regulations, manufacturer manuals, technical bulletins and recognised industry standards in a clear, structured and trustworthy experience.

The platform is intended to reduce time spent searching for technical information, improve decision-making on site and support professional compliance with best-practice guidance.

---

## 2. Vision

To become the trusted AI workspace for UK engineering professionals, helping them make safer, faster and more evidence-based decisions in the field and at the desk.

---

## 3. Mission

To provide reliable, evidence-based technical guidance using official regulations, manufacturer manuals and technical bulletins so engineers can work with greater confidence, clarity and compliance.

---

## 4. Target Users

### Primary users
- Plumbing engineers
- Heating engineers
- Gas Safe engineers
- Service technicians
- Installation engineers
- Small and medium engineering businesses

### Secondary users
- Business owners
- Technical managers
- Training and compliance leads
- Apprentices and junior engineers

### User needs
- Fast access to reliable technical guidance
- Clear references to official sources
- Reduced time spent searching through documentation
- Better support when diagnosing faults and planning repairs
- Confidence in following recognised standards and manufacturer instructions

---

## 5. Product Goals

- Deliver a trustworthy AI experience for technical support
- Provide guidance grounded in verifiable sources
- Improve access to regulations and manufacturer documentation
- Build a professional, mobile-friendly experience for field use
- Create a foundation for future workflow automation and knowledge management

---

## 6. Core Features

### 6.1 Conversational Technical Assistant
- Allow users to ask technical questions in natural language
- Provide concise, structured answers with source references
- Support follow-up questions and clarification prompts

### 6.2 Evidence-Based Responses
- Show references to:
  - Official regulations
  - Manufacturer manuals
  - Technical bulletins
  - Industry guidance
- Highlight confidence level and source reliability

### 6.3 Source Library
- Organise curated documents and reference materials
- Tag documents by category, product type and guidance type
- Support future search and retrieval features

### 6.4 Topic Workflows
- Provide guided workflows for common tasks such as:
  - Boiler diagnostics
  - Fault finding
  - Installation checks
  - Compliance questions
  - Maintenance planning

### 6.5 Saved Chats and Notes
- Enable users to save conversations and create job notes
- Support export or reuse of technical summaries

### 6.6 Professional Interface
- Mobile-first experience suitable for use on site
- Clean layout with modern SaaS design patterns
- Clear navigation and readable response formatting

---

## 7. User Stories

- As a heating engineer, I want to ask a technical question quickly so I can resolve a fault without wasting time searching manuals.
- As a Gas Safe engineer, I want responses grounded in official guidance so I can work safely and confidently.
- As a small business owner, I want my team to access consistent technical information so service quality improves.
- As a junior engineer, I want clear explanations and references so I can learn while working.
- As a service technician, I want to save useful answers for future jobs so I can reuse them efficiently.
- As a compliance lead, I want evidence-based output with source traceability so the product can be trusted internally.

---

## 8. Functional Requirements

### 8.1 User Account Management
- Users should be able to create and manage an account
- Users should be able to save preferences and workspace settings
- Profiles should support company and role information

### 8.2 Chat Experience
- Users should be able to start a new conversation
- Users should be able to ask questions and receive answers
- The system should provide follow-up suggestions where appropriate

### 8.3 Source Handling
- The system should reference source documents where possible
- Source material should be clearly attributed
- Unsupported or uncertain responses should be clearly labelled

### 8.4 Search and Retrieval
- Users should be able to search across stored documents and past conversations
- Search results should prioritise relevant technical references

### 8.5 Content Safety and Reliability
- Responses should avoid unsafe or unsupported advice
- The system should not present unverified information as factual without clear context
- The product should include reviewable or human-verified content pathways where necessary

---

## 9. Non-Functional Requirements

- Fast response times for standard prompts
- Secure handling of user data
- Responsive design for mobile and desktop
- Clear error handling and graceful degradation
- Accessibility support for keyboard navigation and readable content

---

## 10. Technical Architecture

### Recommended architecture
- Frontend: Next.js with TypeScript and Tailwind CSS
- Backend: API routes or serverless functions
- Authentication: email/password or third-party auth provider
- Database: PostgreSQL or equivalent managed database
- Document storage: object storage for manuals, regulations and bulletins
- Search: full-text search layer for documents and chat history
- AI layer: LLM integration with retrieval-augmented generation (RAG)
- Observability: logging, tracing and analytics

### Proposed data flow
1. User submits a question through the web interface
2. The system routes the request to the AI layer
3. Relevant documents are retrieved from the knowledge base
4. The model generates a response using retrieved source material
5. The answer is returned with citations and confidence indicators

### Deployment
- Cloud-hosted application
- Container-based deployment where appropriate
- Environment-based configuration for development, staging and production

---

## 11. Security

### Security requirements
- Secure authentication and session management
- Encryption for data in transit and at rest
- Role-based access where appropriate
- Input validation and sanitisation
- Logging and monitoring for suspicious activity
- Clear data retention and deletion policies

### Data handling considerations
- User content should be treated as sensitive business or personal information
- Source materials should be managed with appropriate permissions
- The system must avoid leaking confidential information to unrelated users

---

## 12. Roadmap

### Phase 1: Foundation
- Landing page and product positioning
- Core chat experience
- Basic source-backed responses
- User account setup

### Phase 2: Reliability and Trust
- Citation display and source transparency
- Better document ingestion workflows
- Improved response quality and prompt safety
- Search across documentation

### Phase 3: Professional Workflow Support
- Saved chats and notes
- Job-specific templates
- Team collaboration features
- Enterprise admin controls

### Phase 4: Expansion
- Mobile app or progressive web app support
- Advanced calculators and checklists
- Integrations with business tools
- Industry-specific modules for plumbing, heating and gas work

---

## 13. Future Features

- Voice input for on-site use
- Offline mode for limited connectivity environments
- Custom knowledge bases for individual companies
- Image-based troubleshooting from photos of equipment
- Compliance checklists and inspection templates
- Multi-language support
- Integration with job management or CRM platforms

---

## 14. Monetisation Ideas

- Subscription plan for individual engineers
- Team plan for small businesses and service companies
- Enterprise licensing for larger organisations
- Premium add-ons for advanced document libraries and integrations
- Usage-based pricing for high-volume access
- White-label deployment for trade associations or training providers

---

## 15. Success Metrics

### Product adoption
- Number of active users
- Weekly and monthly active users
- Conversion from landing page to onboarding

### Engagement
- Average chats per user per week
- Retention rate over 30 and 90 days
- Average response satisfaction score

### Trust and quality
- Percentage of responses with citations
- User-reported accuracy ratings
- Reduction in time spent searching for information

### Business impact
- Customer acquisition cost
- Subscription growth rate
- Expansion revenue from team and enterprise plans

---

## 16. Risks and Considerations

- The quality of outputs depends heavily on the quality of source material
- Regulatory and manufacturer information may change over time
- Users may over-trust AI responses without proper validation
- Content governance and source verification will be essential
- The product must be careful not to provide unsafe or non-compliant advice

---

## 17. Summary

PlumbBud is a professional, evidence-based AI assistant for UK engineering professionals. Its purpose is to make technical guidance more accessible, reliable and practical while maintaining trust through source-backed answers and professional design. The product should evolve from a trusted knowledge assistant into a wider engineering workflow platform over time.
