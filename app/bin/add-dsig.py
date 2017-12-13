from fontTools.ttLib import TTFont, newTable
import sys

DSIG = newTable("DSIG")
DSIG.ulVersion = 1
DSIG.usFlag = 0
DSIG.usNumSigs = 0
DSIG.signatureRecords = []


for path in sys.argv[1:]:
    font = TTFont(path)
    font["DSIG"] = DSIG
    font.save(path)
