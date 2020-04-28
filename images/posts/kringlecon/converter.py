import sys
def makeobject(afunction):
	print("Generating a function for version {}.{} (same version as the machine)".format(sys.version_info.major, sys.version_info.minor))
	newstr = ""
	newstr += "def a():\n"
	newstr +="	return\n\n"
	if sys.version_info.major ==2:
		co = afunction.__code__
		newstr += "a.__code__ = type(a.__code__)({0},{1},{2},{3},'{4}',{5},{6},{7},'{8}','{9}',{10},'{11}')".format( co.co_argcount, co.co_nlocals. co.co_stacksize, co.co_flags, co.co_code.encode("string_escape"),co.co_consts,co.co_names,co.co_varnames,co.co_filename,str(co.co_name),co.co_firstlineno, co.co_lnotab)
	elif sys.version_info.major==3:
		co = afunction.__code__
		newstr += "a.__code__ = type(a.__code__)({0},{1},{2},{3},{4},{5},{6},{7},{8},'{9}','{10}',{11},{12})".format( co.co_argcount, co.co_kwonlyargcount, co.co_nlocals, co.co_stacksize, co.co_flags, co.co_code, co.co_consts, co.co_names, co.co_varnames, co.co_filename, str(co.co_name), co.co_firstlineno, co.co_lnotab)
	print(newstr)
