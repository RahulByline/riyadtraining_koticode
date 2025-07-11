@@ .. @@
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: 0.4 }}
               className="flex flex-col sm:flex-row gap-4 mb-12"
             >
-              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
+              <Button 
+                size="lg" 
+                className="bg-gradient-to-r from-blue-600 to-purple-600"
+                onClick={() => {
+                  const courseBrowserSection = document.getElementById('course-browser');
+                  if (courseBrowserSection) {
+                    courseBrowserSection.scrollIntoView({ behavior: 'smooth' });
+                  }
+                }}
+              >
                 <Play className="w-5 h-5" />
                 {t('exploreBtn')}
               </Button>