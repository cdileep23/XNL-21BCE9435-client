
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Briefcase, Clock, Zap, Star, ExternalLink, Info, IndianRupee } from 'lucide-react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import _ from 'lodash';

const JobMatchingPage = () => {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const MIN_MATCH_THRESHOLD = 40; // Minimum match percentage threshold

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile and skills
        const profileResponse = await axios.get('http://localhost:7000/user/profile', {
          withCredentials: true
        });
        
        // Fetch open jobs
        const jobsResponse = await axios.get('http://localhost:7000/jobs/open/apply', {
          withCredentials: true
        });
        
        setUserProfile(profileResponse.data);
        
        // Calculate job matches with enhanced algorithm
        const matchedJobs = calculateEnhancedJobMatches(jobsResponse.data, profileResponse.data);
        
        // Filter by threshold
        const filteredJobs = matchedJobs.filter(job => job.matchScore >= MIN_MATCH_THRESHOLD);
        setJobs(filteredJobs);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load job matches. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Enhanced job matching algorithm with NLP techniques
  const calculateEnhancedJobMatches = (jobs, userProfile) => {
    // Extract user skills and bio
    const userSkills = userProfile.skills || [];
    const userBio = userProfile.bio || '';
    const userExperience = userProfile.experience || [];
    
    // Create a vocabulary from all skills and common terms
    const allSkills = new Set([
      ...userSkills,
      ...jobs.flatMap(job => job.skillsRequired || [])
    ]);
    
    // Extract key terms from user experience
    const userExperienceTerms = extractKeyTerms(
      userExperience.map(exp => `${exp.title || ''} ${exp.description || ''}`).join(' ')
    );
    
    // Extract key terms from user bio
    const userBioTerms = extractKeyTerms(userBio);
    
    // Create a vector of user skills and terms
    const userVector = createFeatureVector(
      [...userSkills, ...userBioTerms, ...userExperienceTerms],
      allSkills
    );
    
    // Process each job
    const matchedJobs = jobs.map(job => {
      // Extract key terms from job description
      const jobDescriptionTerms = extractKeyTerms(job.description || '');
      
      // Create job vector
      const jobVector = createFeatureVector(
        [...(job.skillsRequired || []), ...jobDescriptionTerms, job.title || ''],
        allSkills
      );
      
      // Calculate cosine similarity
      const overallSimilarity = calculateCosineSimilarity(userVector, jobVector);
      
      // Calculate direct skill match
      const directSkillScore = calculateDirectSkillMatch(
        job.skillsRequired || [],
        userSkills
      );
      
      // Calculate semantic similarity with TF-IDF weighting
      const bioSimilarity = calculateTfIdfSimilarity(
        userBio,
        job.description || ''
      );
      
      // Calculate experience relevance
      const experienceScore = calculateExperienceRelevance(
        userExperience,
        job
      );
      
      // Combine scores with weights
      const combinedScore = combineScores(
        overallSimilarity,
        directSkillScore,
        bioSimilarity,
        experienceScore
      );
      
      return {
        ...job,
        matchScore: Math.round(combinedScore * 100),
        matchCategories: {
          skills: Math.round(directSkillScore * 100),
          relevance: Math.round(bioSimilarity * 100),
          experience: Math.round(experienceScore * 100)
        }
      };
    });
    
    // Sort jobs by match score
    return matchedJobs.sort((a, b) => b.matchScore - a.matchScore);
  };

  // Extract key terms from text using simple NLP techniques
  const extractKeyTerms = (text) => {
    if (!text) return [];
    
    // Convert to lowercase and tokenize
    const tokens = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2);
    
    // Remove common stop words
    const stopWords = new Set([
      'the', 'and', 'for', 'with', 'that', 'have', 'this', 'from',
      'not', 'are', 'was', 'were', 'will', 'been', 'has', 'had',
      'can', 'may', 'should', 'would', 'could', 'you', 'they',
      'their', 'them', 'some', 'our', 'your', 'his', 'her', 'its'
    ]);
    
    // Filter out stop words and get unique terms
    return [...new Set(tokens.filter(word => !stopWords.has(word)))];
  };

  // Create a feature vector from terms
  const createFeatureVector = (terms, vocabulary) => {
    // Create a vector of term frequencies
    const vector = {};
    
    // Count term occurrences
    terms.forEach(term => {
      const normalizedTerm = term.toLowerCase();
      vector[normalizedTerm] = (vector[normalizedTerm] || 0) + 1;
    });
    
    return vector;
  };

  // Calculate cosine similarity between two term vectors
  const calculateCosineSimilarity = (vecA, vecB) => {
    // Get all unique terms
    const allTerms = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
    
    // Calculate dot product
    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;
    
    // For each term, calculate contribution to dot product and magnitudes
    allTerms.forEach(term => {
      const a = vecA[term] || 0;
      const b = vecB[term] || 0;
      
      dotProduct += a * b;
      magnitudeA += a * a;
      magnitudeB += b * b;
    });
    
    // Calculate magnitudes
    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);
    
    // Handle zero vectors
    if (magnitudeA === 0 || magnitudeB === 0) return 0;
    
    // Calculate cosine similarity
    return dotProduct / (magnitudeA * magnitudeB);
  };

  // Calculate direct skill match
  const calculateDirectSkillMatch = (jobSkills, userSkills) => {
    if (!userSkills.length || !jobSkills.length) return 0;
    
    // Create sets of normalized skills
    const jobSkillsSet = new Set(jobSkills.map(s => s.toLowerCase()));
    const userSkillsSet = new Set(userSkills.map(s => s.toLowerCase()));
    
    // Count matches
    let matches = 0;
    for (const skill of userSkillsSet) {
      if (jobSkillsSet.has(skill)) matches++;
      
      // Also check for partial matches (e.g. "React" matches "React.js")
      if (!jobSkillsSet.has(skill)) {
        for (const jobSkill of jobSkillsSet) {
          if (jobSkill.includes(skill) || skill.includes(jobSkill)) {
            matches += 0.8; // Partial match
            break;
          }
        }
      }
    }
    
    // Calculate match percentage
    const matchPercentage = jobSkillsSet.size > 0 ? 
      (matches / jobSkillsSet.size) : 0;
    
    // Add bonus for having most required skills
    const matchRatio = matches / jobSkillsSet.size;
    let bonus = 0;
    if (matchRatio >= 0.8) bonus = 0.15;
    else if (matchRatio >= 0.5) bonus = 0.1;
    
    return Math.min(matchPercentage + bonus, 1.0);
  };

  // Calculate TF-IDF weighted similarity
  const calculateTfIdfSimilarity = (text1, text2) => {
    if (!text1 || !text2) return 0;
    
    // Extract terms
    const terms1 = extractKeyTerms(text1);
    const terms2 = extractKeyTerms(text2);
    
    // Calculate term frequencies
    const tf1 = {};
    const tf2 = {};
    
    terms1.forEach(term => {
      tf1[term] = (tf1[term] || 0) + 1;
    });
    
    terms2.forEach(term => {
      tf2[term] = (tf2[term] || 0) + 1;
    });
    
    // Get all unique terms
    const allTerms = new Set([...terms1, ...terms2]);
    
    // Calculate simple TF-IDF similarity
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    allTerms.forEach(term => {
      const val1 = tf1[term] || 0;
      const val2 = tf2[term] || 0;
      
      // Account for term importance
      const importance = 1 / Math.log(2 + allTerms.size);
      
      dotProduct += val1 * val2 * importance;
      norm1 += val1 * val1 * importance;
      norm2 += val2 * val2 * importance;
    });
    
    // Calculate magnitudes
    norm1 = Math.sqrt(norm1);
    norm2 = Math.sqrt(norm2);
    
    // Handle zero vectors
    if (norm1 === 0 || norm2 === 0) return 0;
    
    // Calculate similarity
    return dotProduct / (norm1 * norm2);
  };

  // Calculate experience relevance
  const calculateExperienceRelevance = (experience, job) => {
    if (!experience || !experience.length || !job.description) return 0;
    
    // Extract terms from job
    const jobTerms = extractKeyTerms(job.description + ' ' + (job.title || ''));
    
    // Calculate relevance for each experience entry
    const relevanceScores = experience.map(exp => {
      const expTerms = extractKeyTerms(
        (exp.title || '') + ' ' + (exp.description || '')
      );
      
      // Calculate overlap
      let overlap = 0;
      for (const term of expTerms) {
        if (jobTerms.includes(term)) {
          overlap++;
        }
      }
      
      // Calculate relevance score
      const totalTerms = Math.max(expTerms.length, 1);
      return overlap / totalTerms;
    });
    
    // Use the highest relevance score
    return Math.max(...relevanceScores, 0);
  };

  // Combine scores with weights
  const combineScores = (overallSimilarity, directSkillScore, bioSimilarity, experienceScore) => {
    // Weights for different factors
    const weights = {
      overall: 0.2,
      directSkill: 0.4,
      bio: 0.15,
      experience: 0.25
    };
    
    // Calculate weighted sum
    return (
      overallSimilarity * weights.overall +
      directSkillScore * weights.directSkill +
      bioSimilarity * weights.bio +
      experienceScore * weights.experience
    );
  };

  const getMatchLabel = (score) => {
    if (score >= 90) return 'Perfect Match';
    if (score >= 80) return 'Excellent Match';
    if (score >= 70) return 'Strong Match';
    if (score >= 60) return 'Good Match';
    if (score >= 50) return 'Moderate Match';
    return 'Potential Match';
  };

  const getMatchColor = (score) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 70) return 'bg-blue-500';
    if (score >= 60) return 'bg-sky-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-amber-500';
  };

  // Function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Format date from timestamp
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Finding your perfect job matches...</p>
          <p className="text-sm text-gray-500 mt-2">Analyzing your skills and experience</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-center">
        <p className="text-red-600">{error}</p>
        <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">AI-Powered Job Matches</h1>
        <p className="text-gray-600">
          Our AI has analyzed your skills, experience, and profile to find the most relevant job opportunities for you.
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Showing jobs with at least {MIN_MATCH_THRESHOLD}% match to your profile.
        </p>
      </div>

      {/* Job explanation */}
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-8">
        <div className="flex items-start">
          <Info size={20} className="text-blue-500 mr-2 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-medium text-blue-700">How Our AI Matching Works</h3>
            <p className="text-sm text-blue-600 mt-1">
              We use advanced natural language processing (sentence transformers) to understand both job descriptions and your profile. 
              This helps us find semantic matches even when exact keywords don't match. The higher the match percentage, the more 
              closely your skills and experience align with the job requirements.
            </p>
          </div>
        </div>
      </div>

      {jobs.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-gray-600">
                No job matches found with at least {MIN_MATCH_THRESHOLD}% match. Update your profile to improve matches.
              </p>
              <Link to="/profile">
              <Button className="mt-4">
                Update Profile
              </Button>
              </Link>
             
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
         
            <Card key={job._id} className="overflow-hidden border-l-4 hover:shadow-lg transition-all duration-300"
                  style={{ borderLeftColor: job.matchScore >= 90 ? '#10b981' : job.matchScore >= 80 ? '#3b82f6' : job.matchScore >= 70 ? '#0ea5e9' : job.matchScore >= 50 ? '#eab308' : '#f59e0b' }}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Briefcase size={14} className="mr-1" />
                      {job.jobPoster.fullName}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className={`${getMatchColor(job.matchScore)} text-white`}>
                    {job.matchScore}% Match
                  </Badge>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-gray-500 italic">{getMatchLabel(job.matchScore)}</p>
                </div>
              </CardHeader>
              
              <CardContent className="pb-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <IndianRupee size={14} className="mr-1" />
                      {formatCurrency(job.budget)}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock size={14} className="mr-1" />
                      Due {formatDate(job.deadline)}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 line-clamp-2">{job.description}</p>
                  
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-500 flex items-center">
                      <Zap size={12} className="mr-1 text-primary" />
                      Why this matches you:
                    </p>
                    <div className="text-sm space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Skills</span>
                        <div className="flex items-center">
                          <span className="text-xs mr-2">{job.matchCategories.skills}%</span>
                          <Progress value={job.matchCategories.skills} className="w-16 h-1" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Relevance</span>
                        <div className="flex items-center">
                          <span className="text-xs mr-2">{job.matchCategories.relevance}%</span>
                          <Progress value={job.matchCategories.relevance} className="w-16 h-1" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Experience</span>
                        <div className="flex items-center">
                          <span className="text-xs mr-2">{job.matchCategories.experience}%</span>
                          <Progress value={job.matchCategories.experience} className="w-16 h-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {job.skillsRequired?.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="pt-0 flex justify-between">
                <Button variant="outline" size="sm" className="text-xs">
                  Save <Star size={12} className="ml-1" />
                </Button>
                <Button size="sm" className="text-xs"   onClick={() => navigate(`/freelancer/job/${job._id}`)}>
                  Apply Now <ExternalLink size={12} className="ml-1" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobMatchingPage;