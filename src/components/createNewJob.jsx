import React, { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, IndianRupee } from "lucide-react";

const CreateJobDialog = ({ open, onOpenChange, onJobCreated }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: 0,
    skillsRequired: [],
  });
  const [newSkill, setNewSkill] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.budget || isNaN(formData.budget))
      newErrors.budget = "Budget must be a valid number";
    if (!formData.deadline || isNaN(formData.deadline) || formData.deadline < 1 || formData.deadline > 10)
      newErrors.deadline = "Deadline must be between 1 and 10 days";
    if (formData.skillsRequired.length === 0)
      newErrors.skillsRequired = "At least one skill is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };
  const handleDeadlineChange = (value) => {
    setFormData((prev) => ({ ...prev, deadline: Number(value) }));
  }
  

  const addSkill = () => {
    if (newSkill.trim() && !formData.skillsRequired.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, newSkill.trim()],
      }));
      setNewSkill("");
      if (errors.skillsRequired) {
        setErrors((prev) => ({ ...prev, skillsRequired: undefined }));
      }
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter(
        (skill) => skill !== skillToRemove
      ),
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await axios.post(
        "http://localhost:7000/job/create",
        formData,
        { withCredentials: true }
      );
      
      toast.success("Job posted successfully!");
      
      // Reset form and close dialog
      setFormData({
        title: "",
        description: "",
        budget: "",
        deadline: "",
        skillsRequired: [],
      });
      
      onOpenChange(false);
      
      // Refresh job list if callback provided
      if (onJobCreated) {
        onJobCreated();
      }
      
      // Navigate to the new job details page
      navigate(`/jobs/${response.data._id}`);
    } catch (error) {
      console.error("Error creating job:", error);
      const errorMessage = error.response?.data?.errors?.[0]?.msg || 
                          error.response?.data?.message || 
                          "Failed to create job. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post a New Job</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new job posting.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Website Development"
                value={formData.title}
                onChange={handleChange}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the job requirements in detail..."
                rows={5}
                value={formData.description}
                onChange={handleChange}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="budget">Budget (₹)</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="budget"
                  name="budget"
                  type="number"
                  placeholder="5000"
                  value={formData.budget}
                  onChange={handleChange}
                  className={`pl-9 ${errors.budget ? "border-red-500" : ""}`}
                />
              </div>
              {errors.budget && (
                <p className="text-sm text-red-500">{errors.budget}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="deadline">Deadline (days)</Label>
              <Select
                value={formData.deadline}
                onValueChange={handleDeadlineChange}
              >
                <SelectTrigger className={errors.deadline ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select deadline" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((day) => (
                    <SelectItem key={day} value={day.toString()}>
                      {day} {day === 1 ? "day" : "days"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.deadline && (
                <p className="text-sm text-red-500">{errors.deadline}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="skills">Skills Required</Label>
              <div className="flex">
                <Input
                  id="skills"
                  placeholder="Add skills (e.g., React, Node.js)"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={errors.skillsRequired ? "border-red-500" : ""}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="ml-2"
                  onClick={addSkill}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {errors.skillsRequired && (
                <p className="text-sm text-red-500">{errors.skillsRequired}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skillsRequired.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="px-2 py-1">
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Posting..." : "Post Job"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateJobDialog;