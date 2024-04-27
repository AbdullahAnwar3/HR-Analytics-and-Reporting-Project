import Chart from 'chart.js/auto';
import { useAuthorize } from "../context/hook/useAuthorization";

import '../styles/login.css'
import '../styles/signup.css'
import '../styles/leave.css'
import 'animate.css';

import NavMenu from "./SharedComponents/navMenu";
import { useState, useEffect, useRef } from "react";
import '../styles/salary.css'; 
import 'chartjs-plugin-datalabels';
import dashBoardImage from './Images/Dashboard/dashboard1.png'

const Analytics = (prop)=>{
    const {userAccount} = useAuthorize();

    // State for fetching and rendering chart data
    const [chartData, setChartData] = useState({ labels: [], dataset: [] });
    const genderChartRef = useRef(null);


    const [salaryData, setSalaryData] = useState({});
    const salaryChartRef = useRef(null);
    const [ageData, setAgeData] = useState({ labels: [], dataset: [] });
    const ageChartRef = useRef(null);
    const [residenceData, setResidenceData] = useState({ labels: [], datasets: [] });
    const residenceChartRef = useRef(null);

    // Fetch gender distribution data with enhanced error handling
    useEffect(() => {
      const fetchGenderData = async () => {
        
          const response = await fetch('/api/analytics/gender', {
            headers: {
                'Authorization': `Bearer ${userAccount.userToken}`
            }
        });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const rawData = await response.json();
          console.log(rawData);
          
          // Filter out entries where `_id` is null
          const validData = rawData.filter(item => item._id);
          const labels = validData.map(item => item._id);
          const dataset = validData.map(item => item.count);
          
          // console.log('Labels:', labels); 
          // console.log('Dataset:', dataset); 
      
          setChartData({
            labels,
            dataset
          });
      
          renderChart(labels, dataset);
        
      };
      const fetchResidenceData = async () => {
        try {
            const response = await fetch('/api/analytics/residence', {
                headers: {
                    'Authorization': `Bearer ${userAccount.userToken}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            setResidenceData({
                labels: data.map(item => item._id),
                datasets: [{
                    label: 'Residence Distribution',
                    data: data.map(item => item.count),
                    backgroundColor: '#003d42', // Set the bar color to dark cyan
                    borderColor: '#003d42', // Set the border color to dark cyan
                    borderWidth: 1
                }]
            });
            
        } catch (error) {
            console.error("Failed to fetch residence data:", error);
        }
    };

      
        const fetchSalary = async () => {
            const result = await fetch('/api/analytics/salary', {
                headers: {
                    'Authorization': `Bearer ${userAccount.userToken}`
                }
            });
    
            // Parsing json results as array of objects.
            const resultJson = await result.json();
    
            if (result.ok) {
                const processedData = processSalaryRanges(resultJson.map(item => item.salary));
                setSalaryData(processedData);
                renderSalaryChart(processedData);
              }
        
              console.log(resultJson);
        }
        const fetchAgeData = async () => {
          try {
            const response = await fetch('/api/analytics/age', {
              headers: {
                'Authorization': `Bearer ${userAccount.userToken}`
              }
            });
        
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
        
            const ageData = await response.json();
            const processedData = processAgeRanges(ageData); // Ensure that this function is passed the entire dataset
            setAgeData(processedData);
            renderAgeChart(processedData); // Make sure this function is defined and correctly implemented
          } catch (error) {
            console.error("Failed to fetch age data:", error);
          }
        };
        
        if(userAccount && userAccount.occupation === 'admin'){
           
            fetchSalary();
            fetchGenderData();
            fetchAgeData();
            fetchResidenceData();
        }

        return () => {
          // Proper cleanup to prevent memory leaks
          if (salaryChartRef.current) {
              salaryChartRef.current.destroy();
              salaryChartRef.current = null;
          }
          if (genderChartRef.current) {
              genderChartRef.current.destroy();
              genderChartRef.current = null;
          }
          if (ageChartRef.current) {
              ageChartRef.current.destroy();
              ageChartRef.current = null;
          }
          if (residenceChartRef.current) {
            residenceChartRef.current.destroy();
            residenceChartRef.current = null;
        }
      };
         
         
    }, [userAccount]);

    useEffect(() => {
      if (residenceData.labels.length > 0 && residenceData.datasets.length > 0) {
          renderResidenceChart();
      }
  }, [residenceData]); 
    

    const processSalaryRanges = (salaries) => {
        const ranges = {
          '0-30000': 0,
          '30001-60000': 0,
          '60001-90000': 0,
          '90001+': 0
        };
      
        salaries.forEach(salary => {
          if (salary < 30001) ranges['0-30000']++;
          else if (salary < 60001) ranges['30001-60000']++;
          else if (salary < 90001) ranges['60001-90000']++;
          else ranges['90001+']++;
        });
      
        return {
          labels: Object.keys(ranges),
          datasets: Object.values(ranges)
        };
      };
      const processAgeRanges = (ageData) => {
        const rangeMappings = {
          0: '0-18',
          18: '19-30',
          30: '30-45',
          45: '19-30',
          
          // Add mappings for other groups you have defined in your backend
          // This depends on the buckets you have set in your MongoDB aggregation
          '120+': '61+' // Assuming '120+' means '61+' in your case
        };
      
        const ranges = {
          '0-18': 0,
          '19-30': 0,
          '31-45': 0,
          '46-60': 0,
          '61+': 0
        };
      
        ageData.forEach(item => {
          const ageGroup = rangeMappings[item._id]; // Map the identifier to the age range label
          if (ageGroup && ranges.hasOwnProperty(ageGroup)) {
            ranges[ageGroup] += item.count;
          }
        });
      
        return {
          labels: Object.keys(ranges),
          dataset: Object.values(ranges)
        };
      };

      const renderSalaryChart = (salaryData) => {
        const canvasId = 'salaryChart';
        const canvasElement = document.getElementById(canvasId);
        const ctx = canvasElement.getContext('2d');
    
        // Check and destroy the previous instance if exists
        if (salaryChartRef.current) {
            salaryChartRef.current.destroy();
            salaryChartRef.current = null; // Clear the reference
        }
    
        // Sometimes it's necessary to clear the canvas manually
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
        // Create the new chart instance
        salaryChartRef.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: salaryData.labels,
                datasets: [{
                    data: salaryData.datasets,
                    backgroundColor: 'rgba(4, 44, 56, 0.2)',
                    borderColor: 'rgba(4, 44, 56, 1)',
                    borderWidth: 2,
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            drawBorder: true,
                            drawTicks: true,
                            drawOnChartArea: false,
                        },
                        ticks: {
                            font: {
                                weight: 'bold'
                            }
                        }
                    },
                    x: {
                        grid: {
                            drawBorder: true,
                            drawTicks: true,
                            drawOnChartArea: false,
                        },
                        ticks: {
                            font: {
                                weight: 'bold'
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        enabled: true
                    }
                },
                interaction: {
                    mode: 'nearest',
                    intersect: true
                }
            }
        });
    };

    const renderChart = (labels, dataset) => {
      if (genderChartRef.current) {
          genderChartRef.current.destroy();
          genderChartRef.current = null;
      }
  
      const ctx = document.getElementById('genderChartt').getContext('2d');
      genderChartRef.current = new Chart(ctx, {
          type: 'bar', // Confirm the correct type, potentially 'horizontalBar' if that was your intent
          data: {
              labels: labels,
              datasets: [{
                  label: 'Gender Distribution',
                  data: dataset,
                  backgroundColor: [
                      '#99a0a0',
                      '#003d42', // Color for females
                      // Add more colors if there are more categories
                  ],
                  borderColor: [
                      '#003d42', // Border color for males
                      '#000000', // Border color for females
                      // Add more border colors if needed
                  ],
                  borderWidth: 2
              }]
          },
          options: {
              indexAxis: 'y', 
              scales: {
                  x: {
                      beginAtZero: true,
                      grid: {
                          display: false // Disable display of grid lines
                      },
                      ticks: {
                          stepSize: 1, // Set the step size of the axis ticks
                      }
                  },
                  y: {
                      grid: {
                          display: false // Disable display of grid lines
                      }
                  }
              },
              plugins: {
                  legend: {
                      display: false,
                  },
                  tooltip: {
                      enabled: true
                  }
              }
          }
      });
  };
  
      const renderAgeChart = ({ labels, dataset }) => {
        if (ageChartRef.current) {
          ageChartRef.current.destroy(); // Destroy the existing chart instance before creating a new one
        }
      
        const ctx = document.getElementById('ageChart').getContext('2d');
        ageChartRef.current = new Chart(ctx, {
          type: 'pie',
          data: {
            labels,
            datasets: [{
              data: dataset,
              backgroundColor: [
                '#03383a', // Dark Slate Greyish Blue
                '#0f585b', // Dark Moderate Cyan
                '#40a3a3', // Soft Cyan
                '#66c4bc', // Soft Cyan - Lime Greenish
                '#99a0a0'  // Grey
              ],
              borderColor: 'rgba(255, 255, 255, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: 'top',
              },
              tooltip: {
                enabled: true
              }
            }
          }
        });
      };

      const renderResidenceChart = () => {
        const ctx = document.getElementById('residenceChart').getContext('2d');
        
        // Destroy the old chart instance if it exists
        if (residenceChartRef.current) {
            residenceChartRef.current.destroy();
        }
        
        // Create the new chart instance
        residenceChartRef.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: residenceData.labels, // Make sure this contains your labels from the state
                datasets: [{
                    label: 'Residence Distribution',
                    data: residenceData.datasets[0].data, // Make sure this contains your data from the state
                    backgroundColor: '#003d42', // Set the bar color
                    borderColor: '#003d42', // Set the border color
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1 // Ensure y-axis ticks increment by 1
                        }
                    },
                    x: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: false  // Set this to true if you want to display the legend
                    },
                    tooltip: {
                        enabled: true
                    }
                }
            }
        });
    };
    
      
      return (   
        <div className="analytics">
          <NavMenu isAdmin={true} breadcrum="Analytics" pagePath="/analytics"/>
          <div className="reload-text" onClick={() => window.location.reload()}>Reload</div>
    
          <div className="title-container">
            <div className="data-dashboard-container">
              <h1 className='data-dashboard-text'>Data Dashboard</h1>
              <img src={dashBoardImage} className='dashBoardImage'/>
            </div>
          </div>
    
          <div className="chart-container" style={{ width: '50%', margin: 'auto' }}>
            <div className="chart-title-bar"><h1>Salary Ranges of Employees</h1></div>
            <canvas id="genderChart"></canvas>
            <canvas id="salaryChart" className="chart-border"></canvas>
          </div>
    
          <div style={{ width: '50%', margin: 'auto' }}>

            <div className="age-title-bar"><h1>Age Ranges of Employees</h1></div>
            <canvas id="ageChart" className="chart-border"></canvas>
            <div className="gender-title-bar"><h1>Gender Distribution of Employees</h1></div>
            <canvas id="genderChartt" className="chart-border"></canvas>
            <div className="residence-title-bar"><h1>Residence Distribution</h1></div>
            <canvas id="residenceChart" className="chart-border"></canvas>
            
          </div>
        </div>
    );
    
}

export default Analytics;
