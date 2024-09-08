import Navbar from '../components/navbar';
import loginImage from '../assets/step1.jpg';
import navigateImage from '../assets/step2.jpg';
import viewCourseDetailsImage from '../assets/step4.jpg';
import submitRegistrationImage from '../assets/step3.jpg';
import approvalImage from '../assets/step5.jpg';

const steps = [
  {
    title: "Step 1: Login to Portal",
    description: `Log in to the student portal using your credentials. The portal is your primary gateway to all academic resources, course registrations, and personal information. Ensure that you have your login details handy. If you encounter any issues, please contact the university's IT support. Access the portal at the following link:<a href="https://firars.futa.edu.ng/app/welcome/appindex" class="text-blue-900"> FUTA Undergraduate Portal.</a>`,
    image: loginImage,
  },
  {
    title: "Step 2: Navigate to Course Registration",
    description: `Proceed to the course registration section of the student portal. This section allows you to select and enroll in courses for the upcoming semester. Before you begin the registration process, ensure that all outstanding school fees have been paid. Registration will not be possible if there are any unpaid fees.`,
    image: navigateImage,
  },
  {
    title: "Step 3: View Course Details",
    description: `Review your registered courses. Any carry-over courses will be displayed in the outstanding box.`,
    image: viewCourseDetailsImage,
  },
  {
    title: "Step 4: Submit Course Registration",
    description: `Click on the submit button to finalize your course registration.`,
    image: submitRegistrationImage,
  },
  {
    title: "Step 5: Visit Admission Office for Approval",
    description: `After submitting, visit the admission office to get your course registration approved.`,
    image: approvalImage,
  },
];

const CourseRegistrationPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10">
          Course Registration Guide
        </h1>
        <div className="space-y-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-6"
            >
              <img
                src={step.image}
                alt={step.title}
                className="w-full md:w-64 md:h-64 object-cover rounded-lg shadow-lg"
              />
              <div className="md:w-1/2">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {step.title}
                </h2>
                <p
                  className="text-gray-600"
                  dangerouslySetInnerHTML={{ __html: step.description }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseRegistrationPage;
