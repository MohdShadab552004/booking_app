import ExperienceCard from "../components/cards/ExperienceCard";
import { useExperiences } from "../hooks/useExperiences";
import Loading from "../components/ui/Loading.tsx"

const Home = () => {
  const { experiences, loading, error } = useExperiences();

  if (loading) {
    return (
     <Loading /> 
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-10 text-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-items-center gap-6">
      {experiences.map((exp) => (
        <ExperienceCard 
          key={exp._id}
          id={exp._id}
          image={exp.image}
          title={exp.title}
          location={exp.location}
          description={exp.description}
          price={exp.price}
        />
      ))}
    </div>
  );
};

export default Home;