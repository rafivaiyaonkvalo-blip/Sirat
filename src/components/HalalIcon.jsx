import React from 'react';
import { 
  BookOpen, PenTool, Landmark, Home, Clock, Trees, Flower, 
  Sparkles, Shield, DoorOpen, Car, Waves, Mountain, Briefcase, 
  Armchair, Bed, GraduationCap, Columns, Maximize, Maximize2, 
  Minimize, Minimize2, Fan, Tv, LayoutGrid, Sun, History, 
  AlertCircle, CheckCircle2, User, UserCheck, Users, HeartHandshake, 
  BadgeCheck, Stethoscope, Compass, Box, ArrowUp, ArrowDown, 
  ArrowLeft, ArrowRight, LogIn, LogOut, Folder, ShoppingBag, 
  Building2, Cloud, Globe, Key, Milestone, Apple, Droplets, 
  Split, Navigation, MapPin, Heart, HelpCircle, CheckSquare, Check, X, ShieldAlert, ShieldCheck, Lock, Unlock, Award
} from 'lucide-react';

const iconMap = {
  BookOpen, PenTool, Landmark, Home, Clock, Trees, TreePine: Trees, Flower, Flower2: Flower, 
  Sparkles, Shield, DoorOpen, Car, Waves, Mountain, Briefcase, 
  Armchair, Bed, GraduationCap, Columns, Maximize, Maximize2, 
  Minimize, Minimize2, Fan, Tv, LayoutGrid, Sun, History, 
  AlertCircle, CheckCircle2, User, UserCheck, Users, HeartHandshake, 
  BadgeCheck, Stethoscope, Compass, Box, ArrowUp, ArrowDown, 
  ArrowLeft, ArrowRight, LogIn, LogOut, Folder, ShoppingBag, 
  Building2, Cloud, Globe, Key, Milestone, Apple, Droplets, 
  Split, Navigation, MapPin, Heart, HelpCircle, CheckSquare, Check, X, ShieldAlert, ShieldCheck, Lock, Unlock, Award
};

export default function HalalIcon({ name, size = 22, className = '' }) {
  const IconComponent = iconMap[name] || BookOpen;
  return <IconComponent size={size} className={className} />;
}
