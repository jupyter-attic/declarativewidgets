#   Installer to replace the master IRkernel with custom IRkernel in git repo
#
#   To install the widgets package the options are:
#   1) install from source location
#       R CMD INSTALL .
#   2) package as tgz and install from tgz build/package
#       R CMD INSTALL --build .
#       R CMD INSTALL widgets_0.1.tgz
#

temp_libPaths <- .libPaths()
.libPaths(temp_libPaths[2])
Sys.setenv(TAR = '/bin/tar')
install.packages(c("devtools", "httr"), repos='http://cran.us.r-project.org', quiet = TRUE)
library(RCurl)
library(httr)
set_config(config(ssl_verifypeer = 0L))
try(library(devtools), silent = TRUE)
remove.packages("repr")
remove.packages("IRdisplay")
remove.packages("IRkernel")
install_git("https://github.com/IRkernel/repr.git", quiet = TRUE)
install_git("https://github.com/IRkernel/IRdisplay.git", quiet = TRUE)
install_git("https://github.com/IRkernel/IRkernel.git", quiet = TRUE)
