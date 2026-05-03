'use client';
import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

const categories = [
{
  name: 'Dresses',
  count: '240+ styles',
  img: "https://images.unsplash.com/photo-1708302668687-0bdc015843be",
  alt: 'Elegant woman in floral dress, soft natural light, airy feminine look',
  span: 'lg:col-span-2 lg:row-span-2',
  height: 'h-72 lg:h-full'
},
{
  name: 'Sarees',
  count: '180+ styles',
  img: "https://images.unsplash.com/photo-1614855918624-d184f79a112a",
  alt: 'Woman draped in vibrant silk saree, traditional gold jewellery, warm lighting',
  span: 'lg:col-span-1',
  height: 'h-56'
},
{
  name: 'Kurtis',
  count: '320+ styles',
  img: "https://img.rocket.new/generatedImages/rocket_gen_img_181874d98-1772088386421.png",
  alt: 'Woman in embroidered kurti, block print cotton, ethnic casual wear',
  span: 'lg:col-span-1',
  height: 'h-56'
},
{
  name: 'Tops',
  count: '410+ styles',
  img: "https://images.unsplash.com/photo-1647671676805-621cfc2df4b2",
  alt: 'Fashionable woman in chic top, urban street style, modern feminine look',
  span: 'lg:col-span-1',
  height: 'h-56'
},
{
  name: 'Ethnic Wear',
  count: '150+ styles',
  img: "https://img.rocket.new/generatedImages/rocket_gen_img_165474e9b-1772791322935.png",
  alt: 'Woman in traditional ethnic wear, embroidered suit, festive occasion',
  span: 'lg:col-span-2',
  height: 'h-56'
}];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 }
  }
};

const MotionLink = motion(Link);

export default function CategoriesSection() {
  return (
    <section className="py-16 lg:py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
        >
          <motion.div variants={itemVariants}>
            <p className="text-xs font-semibold tracking-widest uppercase text-accent mb-2">Collections</p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight">
              Shop by Category
            </h2>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Link
              href="/shop"
              className="text-sm font-medium text-primary hover:text-accent transition-colors flex items-center gap-1.5 group"
            >
              View all categories
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Bento Grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={containerVariants}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 lg:grid-rows-2"
        >
          {categories?.map((cat, i) => (
            <MotionLink
              variants={itemVariants}
              whileHover={{ scale: 0.98 }}
              key={cat?.name}
              href="/shop"
              className={`group relative overflow-hidden rounded-2xl ${cat?.span} ${cat?.height} cursor-pointer block`}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 w-full h-full"
              >
                <AppImage
                  src={cat?.img}
                  alt={cat?.alt}
                  fill
                  className="object-cover object-center product-card-img"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </motion.div>
              
              {/* Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
              {/* Gold hover overlay */}
              <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors duration-500 pointer-events-none" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="font-display text-white font-bold text-lg lg:text-xl">{cat?.name}</h3>
                <p className="text-white/70 text-xs mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {cat?.count}
                </p>
              </div>

              {/* Arrow badge */}
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/0 group-hover:bg-accent transition-all duration-300 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 text-transparent group-hover:text-primary transition-colors duration-300" />
              </div>
            </MotionLink>
          ))}
        </motion.div>
      </div>
    </section>
  );
}