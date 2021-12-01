from ctypes import CDLL
import sys
import Quartz
loginPF = CDLL('/System/Library/PrivateFrameworks/login.framework/Versions/Current/login')

def is_screen_locked():
    d=Quartz.CGSessionCopyCurrentDictionary()
    return 'CGSSessionScreenIsLocked' in d.keys()

def lock_screen():
    return loginPF.SACLockScreenImmediate()



if __name__ == "__main__":
    if len(sys.argv) < 2:
        print('missing command')
        sys.exit()

    input_path = sys.argv[1]
    if(input_path == "lock"):
        lock_screen()
    
    if(input_path == "check"):
        print(is_screen_locked())