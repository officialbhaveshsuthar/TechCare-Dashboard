const pContainer = document.getElementById('patients-container');
const respiratory = document.getElementById('respiratory-rate');
const temperature = document.getElementById('temperature');
const heartRate = document.getElementById('heart-rate');
const heartRateStatus = document.getElementById('heart-rate-status');
const dTableBody = document.querySelector('.table-body');
const patientname = document.getElementById('patientname');
const patientimage = document.getElementById('patientimg');
const dateofbirth = document.getElementById('Dateofbirth');
const gender = document.getElementById('gender');
const contact = document.getElementById('contact');
const emergencynumber = document.getElementById('emergencynumber');
const patientinsu = document.getElementById('insuprovider');
const labresultsdata = document.querySelector('.lab-result-content2');
const systolicValue = document.getElementById('systolic-value')
const diastolicValue = document.getElementById('diastolic-value')
const sLevls = document.getElementById('s-levls')
const dLevls = document.getElementById('d-levls')


document.addEventListener('DOMContentLoaded', () => {
  const username = 'coalition';
  const password = 'skills-test';
  const auth = btoa(`${username}:${password}`);
  const apiUrl = 'https://fedskillstest.coalitiontechnologies.workers.dev';


  function fetchPatients() {
    fetch(apiUrl, {
      headers: {
        'Authorization': `Basic ${auth}`
      }
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok');
      })

      .then(function (data) {
        let active = 3
        showD(data[active])
        diagnosticslist(data[active])
        patientprofile(data[active])
        labcontent(data[active])
        chartData(data[active])


        data.map((item, index) => {

          // Patient List Data
          const patients = document.createElement('div')
          pContainer.appendChild(patients)
          patients.classList.add('patients-profile-data');
          patients.innerHTML = `

  <div class="picture-dp-name" >
   <img src="${item.profile_picture}" alt="profile-img">
   <p>${item.name}<span>${item.gender} ${item.age}</span></p>
  </div>
 <div class="patient-more">
  <img src="img/more_horiz_FILL0_wght300_GRAD0_opsz24/more_horiz_FILL0_wght300_GRAD0_opsz24.png" alt="More">
  </div>`

          const buttons = document.querySelectorAll('.patients-profile-data')
          buttons.forEach(button => {
            button.addEventListener('click', function () {
              buttons.forEach(btn => btn.classList.remove('patientbg'))
              this.classList.add('patientbg')
            })
          })

          document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', function () {
              document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('menubar'));
              this.classList.add('menubar');
            });
          });

          patients.addEventListener('click', function () {
            showD(item)
            diagnosticslist(item)
            patientprofile(item)
            labcontent(item)
            chartData(item)
          })
        })
      })

      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  fetchPatients();
});

// Patient Diagnostics Data
function diagnosticslist(item) {
  if (Array.isArray(item.diagnostic_list)) {
    dTableBody.innerHTML = ''; // Clear previous data
    item.diagnostic_list.forEach(list => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${list.name}</td>
        <td>${list.description}</td>
        <td>${list.status}</td>
      `;
      dTableBody.appendChild(tr);
    });
  } else {
    console.error('Invalid diagnostic_list property:', item.diagnostic_list);
  }
}

function showPatientData(patient) {
  if (patient && patient.diagnostic_list) {
    diagnosticslist(patient);
  } else {
    console.error('Invalid patient object:', patient);
  }
}

// profile data 
function patientprofile(item) {
  patientimage.querySelector('img').src = item.profile_picture;
  patientname.querySelector('h5').textContent = item.name;
  birth.innerText = item.date_of_birth;
  gender.innerText = item.gender;
  contact.innerText = item.phone_number;
  emergencynumber.innerText = item.emergency_contact;
  insuprovider.innerText = item.insurance_type;
}

// Lab Result Data
function labcontent(item) {
  // Clear existing content
  labresultsdata.innerHTML = '';
  // Add new content
  item.lab_results.forEach(lab => {
    const resultdata = document.createElement('div');
    labresultsdata.appendChild(resultdata);
    resultdata.classList.add('lab-result-data2');
    resultdata.innerHTML = `
          <p>${lab}</p>
           <img src="img/download_FILL0_wght300_GRAD0_opsz24 (1).png" alt="">
      `;
  });
}

// Chart and Bloor Pressure Data
const ctx = document.getElementById('myChart').getContext('2d');
let myChart; // Variable to keep track of the chart instance

function myFun(diastolic, systolic) {
  // Destroy the existing chart if it exists
  if (myChart) {
    myChart.destroy();
  }

  // Create a new chart
  myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Oct, 2023', 'Nov, 2023', 'Dec, 2023', 'Jan, 2024', 'Feb, 2024', 'Mar, 2024'],
      datasets: [
        {
          label: 'Diastolic',
          data: diastolic,
          borderColor: 'rgba(255, 90, 132)',
          fill: false,
        },
        {
          label: 'Systolic',
          data: systolic,
          borderColor: 'rgba(63, 166, 236)',
          fill: false,
        }
      ]
    },
    options: {
      plugins: {
        legend: {
          display: false, // Display legend if needed
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          min: 60,
          max: 180,
          ticks: {
            stepSize: 20,
          }
        }
      }
    }
  });
}

var diastolic = ''
var systolic = ''
var slevls = ''
var dlevls = ''

const chartData = (item) => {
  if (item) {
    diastolic = item.diagnosis_history.map((e) => {
      return e.blood_pressure.diastolic.value;
    })
    systolic = item.diagnosis_history.map((e) => {
      return e.blood_pressure.systolic.value;
    })
    slevls = item.diagnosis_history.map((e) => {
      return e.blood_pressure.systolic.levels;
    })
    dlevls = item.diagnosis_history.map((e) => {
      return e.blood_pressure.diastolic.levels;
    })

    myFun(diastolic, systolic)
    systolicValue.innerText = systolic[0]
    diastolicValue.innerText = diastolic[0]
    sLevls.innerText = slevls[0]
    dLevls.innerText = dlevls[0]
  }
}

let patientChart;

function updateChartData(item) {
  if (patientChart) {
    patientChart.data.labels = newDatalabels;
    patientChart.data.datasets[0].data = item.systolicData;
    patientChart.data.datasets[1].data = item.diastolicData;
    patientChart.update(0);
  }
}

function showD(item) {
  item.diagnosis_history.forEach(element => {
    respiratory.innerText = element.respiratory_rate.value
    temperature.innerText = element.temperature.value
    heartRate.innerText = element.heart_rate.value
    heartRateStatus.innerText = element.heart_rate.levels
  });
}