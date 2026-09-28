// Mock Data for DocuMind AI UI Preview (Frontend Only)
// Note: Real data integration will connect via API in subsequent phases.

export const mockWorkspaces = [
  {
    id: "ws-1",
    name: "Quantum Machine Learning Benchmarks",
    description: "Evaluating QNN convergence rates vs classical transformers on tabular financial data.",
    papersCount: 14,
    updatedAt: "2 hours ago",
    status: "Active",
    tags: ["Quantum AI", "Benchmarking", "Finance"]
  },
  {
    id: "ws-2",
    name: "Gene Editing CRISPR-Cas12 Review",
    description: "Literature synthesis of off-target cleavage prevention in mammalian cell cultures.",
    papersCount: 28,
    updatedAt: "Yesterday",
    status: "Active",
    tags: ["Biotech", "CRISPR", "Genomics"]
  },
  {
    id: "ws-3",
    name: "Solid State Battery Electrolytes 2026",
    description: "Comparative evidence review on lithium-sulfide dendrite suppression mechanisms.",
    papersCount: 9,
    updatedAt: "3 days ago",
    status: "Completed",
    tags: ["Materials", "Energy", "Electrochemistry"]
  }
];

export const mockRecentActivity = [
  {
    id: "act-1",
    type: "upload",
    title: "Uploaded 3 new papers to Quantum ML",
    timestamp: "10 mins ago",
    user: "Dr. Sarah Chen"
  },
  {
    id: "act-2",
    type: "comparison",
    title: "Generated comparison matrix for Cas12a vs Cas12f",
    timestamp: "1 hour ago",
    user: "Dr. Sarah Chen"
  },
  {
    id: "act-3",
    type: "gap",
    title: "Identified research gap in solid-state electrolyte thermal stability",
    timestamp: "4 hours ago",
    user: "Dr. Sarah Chen"
  }
];

export const mockChatMessages = [
  {
    id: "msg-1",
    role: "user",
    content: "What are the primary mechanisms proposed by Chen et al. (2025) for preventing dendrite growth in sulfide electrolytes?",
    timestamp: "10:14 AM"
  },
  {
    id: "msg-2",
    role: "assistant",
    content: "Based on **Chen et al. (2025)**, dendrite growth in solid-state sulfide electrolytes is suppressed through three core mechanisms:\n\n1. **In-situ SEI Layer Formatting**: Applying a fluorinated interface layer that forms a high-interfacial-energy LiF interphase [Citation 1].\n2. **Elastic Modulus Optimization**: Tuning the polymer binder elasticity to exceed 18 GPa, mechanically suppressing dendrite propagation [Citation 2].\n3. **Isotropic Ion Flux Redistribution**: Utilizing nano-porous ceramic fillers to eliminate local electric field concentrations.",
    timestamp: "10:15 AM",
    citations: [
      {
        id: "cit-1",
        title: "Fluorinated Interlayer Dynamics in Sulfide Solid Electrolytes",
        authors: "Chen, X., Zhao, Y., & Kumar, R. (2025)",
        journal: "Nature Energy, 10(2), 142-153",
        snippet: "The insertion of 5nm LiF-rich interlayers elevated the critical current density to 4.2 mA/cm² without short-circuiting."
      },
      {
        id: "cit-2",
        title: "Mechanical Mechanics of Dendrite Propagation in Ceramic Interfaces",
        authors: "Rodriguez, M. & Zhang, L. (2024)",
        journal: "Advanced Materials, 36(18), e2309841",
        snippet: "Finite element analysis demonstrated that shear modulus > 18 GPa redirects dendrite growth laterally rather than perpendicularly."
      }
    ]
  }
];

export const mockUploadedPapers = [
  {
    id: "paper-1",
    title: "Fluorinated Interlayer Dynamics in Sulfide Solid Electrolytes",
    authors: "Chen, X., Zhao, Y., et al.",
    year: "2025",
    journal: "Nature Energy",
    chunks: 42,
    fileSize: "2.4 MB",
    status: "Indexed"
  },
  {
    id: "paper-2",
    title: "Mechanical Mechanics of Dendrite Propagation",
    authors: "Rodriguez, M. & Zhang, L.",
    year: "2024",
    journal: "Advanced Materials",
    chunks: 36,
    fileSize: "1.8 MB",
    status: "Indexed"
  },
  {
    id: "paper-3",
    title: "High-Voltage Stability of Sulfide All-Solid-State Batteries",
    authors: "Kim, J. & Patel, A.",
    year: "2025",
    journal: "ACS Energy Letters",
    chunks: 58,
    fileSize: "3.1 MB",
    status: "Indexed"
  }
];

export const mockComparisonMatrix = [
  {
    metric: "Critical Current Density (CCD)",
    paperA: "4.2 mA/cm² (LiF Interlayer)",
    paperB: "2.8 mA/cm² (Polymer Binder)",
    paperC: "5.1 mA/cm² (Hybrid Composite)",
    verdict: "Paper C achieves highest CCD"
  },
  {
    metric: "Interfacial Resistance",
    paperA: "14 Ω·cm² at 25°C",
    paperB: "32 Ω·cm² at 25°C",
    paperC: "11 Ω·cm² at 25°C",
    verdict: "Paper C shows lowest impedance"
  },
  {
    metric: "Synthesis Complexity",
    paperA: "Moderate (ALD deposition)",
    paperB: "Low (Solution casting)",
    paperC: "High (Multi-step sintering)",
    verdict: "Paper B is easiest to scale"
  }
];
