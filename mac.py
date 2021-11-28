from ctypes import CDLL
import sys
import Quartz
loginPF = CDLL('/System/Library/PrivateFrameworks/login.framework/Versions/Current/login')

def is_screen_locked():
    d=Quartz.CGSessionCopyCurrentDictionary()
    return 'CGSSessionScreenIsLocked' in d.keys()

def lock_screen():
    return loginPF.SACLockScreenImmediate()
