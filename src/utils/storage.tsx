interface Project {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
}

interface Reimbursement {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string;
}

interface DiscontinuedProject {
  id: number;
  name: string;
  days: number;
  payment: number;
}

interface SaveData {
  projects: Project[];
  reimbursements: Reimbursement[];
  discontinuedProjects: DiscontinuedProject[];
  overtimeHours: number;
  timestamp: string;
}

export const saveDataToFile = (projects: Project[], reimbursements: Reimbursement[], overtimeHours: number, discontinuedProjects: DiscontinuedProject[] = []) => {
  const data: SaveData = {
    projects,
    reimbursements,
    discontinuedProjects,
    overtimeHours,
    timestamp: new Date().toISOString()
  };

  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `rooche-salary-data-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const loadDataFromFile = (): Promise<SaveData | null> => {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        resolve(null);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonString = e.target?.result as string;
          const data: SaveData = JSON.parse(jsonString);
          resolve(data);
        } catch (error) {
          alert('Error reading file. Please make sure it\'s a valid Rooche salary data file.');
          resolve(null);
        }
      };
      reader.readAsText(file);
    };
    
    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
  });
};

export const saveToLocalStorage = (projects: Project[], reimbursements: Reimbursement[], overtimeHours: number, discontinuedProjects: DiscontinuedProject[] = []) => {
  const data: SaveData = {
    projects,
    reimbursements,
    discontinuedProjects,
    overtimeHours,
    timestamp: new Date().toISOString()
  };
  
  localStorage.setItem('rooche-salary-data', JSON.stringify(data));
};

export const loadFromLocalStorage = (): SaveData | null => {
  try {
    const saved = localStorage.getItem('rooche-salary-data');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }
  return null;
};