import { Operation } from "../operation.model";
import { memory } from "@/memory/memory";
import { CPU } from "@/cpu/cpu";

export function createJumpOperations(cpu: CPU): Operation[] {
  const jumpOperations: Operation[] = [];
  const { registers } = cpu;

  jumpOperations.push({
    get instruction() {
      return `JP 0x${memory.readWord(registers.programCounter.value).toString(16)}`
    },
    byteDefinition: 0b11_000_011,
    cycleTime: 4,
    byteLength: 3,
    execute() {
      registers.programCounter.value = memory.readWord(registers.programCounter.value);
    }
  });

  jumpOperations.push({
    get instruction() {
      return `JP NZ, 0x${memory.readWord(registers.programCounter.value).toString(16)}`
    },
    byteDefinition: 0b11_000_010,
    get cycleTime() {
      return !registers.flags.isResultZero ? 4 : 3;
    },
    byteLength: 3,
    execute() {
      if (!registers.flags.isResultZero) {
        registers.programCounter.value = memory.readWord(registers.programCounter.value);
      } else {
        registers.programCounter.value += 2;
      }
    }
  });

  jumpOperations.push({
    get instruction() {
      return `JP Z, 0x${memory.readWord(registers.programCounter.value).toString(16)}`
    },
    byteDefinition: 0b11_001_010,
    get cycleTime() {
      return registers.flags.isResultZero ? 4 : 3;
    },
    byteLength: 3,
    execute() {
      if (registers.flags.isResultZero) {
        registers.programCounter.value = memory.readWord(registers.programCounter.value);
      } else {
        registers.programCounter.value += 2;
      }
    }
  });

  jumpOperations.push({
    get instruction() {
      return `JP NC, 0x${memory.readWord(registers.programCounter.value).toString(16)}`
    },
    byteDefinition: 0b11_010_010,
    get cycleTime() {
      return !registers.flags.isCarry ? 4 : 3;
    },
    byteLength: 3,
    execute() {
      if (!registers.flags.isCarry) {
        registers.programCounter.value = memory.readWord(registers.programCounter.value);
      } else {
        registers.programCounter.value += 2;
      }
    }
  });

  jumpOperations.push({
    get instruction() {
      return `JP C, 0x${memory.readWord(registers.programCounter.value).toString(16)}`
    },
    byteDefinition: 0b11_011_010,
    get cycleTime() {
      return registers.flags.isCarry ? 4 : 3;
    },
    byteLength: 3,
    execute() {
      if (registers.flags.isCarry) {
        registers.programCounter.value = memory.readWord(registers.programCounter.value);
      } else {
        registers.programCounter.value += 2;
      }
    }
  });

  jumpOperations.push({
    get instruction() {
      const value = memory.readSignedByte(registers.programCounter.value);
      if (value >= 0) {
        return `JR 0x${value.toString(16)}`;
      } else {
        return `JR -0x${(value * -1).toString(16)}`;
      }
    },
    byteDefinition: 0b00_011_000,
    cycleTime: 3,
    byteLength: 2,
    execute() {
      const jumpDistance = memory.readSignedByte(registers.programCounter.value);
      registers.programCounter.value++;
      registers.programCounter.value = registers.programCounter.value + jumpDistance;
    }
  });

  jumpOperations.push({
    get instruction() {
      const value = memory.readSignedByte(registers.programCounter.value);
      if (value >= 0) {
        return `JR NZ 0x${value.toString(16)}`;
      } else {
        return `JR NZ -0x${(value * -1).toString(16)}`;
      }
    },
    byteDefinition: 0b00_100_000,
    cycleTime: !registers.flags.isResultZero ? 3 : 2,
    byteLength: 2,
    execute() {
      if (!registers.flags.isResultZero) {
        const jumpDistance = memory.readSignedByte(registers.programCounter.value);
        registers.programCounter.value++;
        registers.programCounter.value = registers.programCounter.value + jumpDistance;
      } else {
        registers.programCounter.value++;
      }
    }
  });

  jumpOperations.push({
    get instruction() {
      const value = memory.readSignedByte(registers.programCounter.value);
      if (value >= 0) {
        return `JR Z 0x${value.toString(16)}`;
      } else {
        return `JR Z -0x${(value * -1).toString(16)}`;
      }
    },
    byteDefinition: 0b00_101_000,
    cycleTime: registers.flags.isResultZero ? 3 : 2,
    byteLength: 2,
    execute() {
      if (registers.flags.isResultZero) {
        const jumpDistance = memory.readSignedByte(registers.programCounter.value);
        registers.programCounter.value++;
        registers.programCounter.value = registers.programCounter.value + jumpDistance;
      } else {
        registers.programCounter.value++;
      }
    }
  });

  jumpOperations.push({
    get instruction() {
      const value = memory.readSignedByte(registers.programCounter.value);
      if (value >= 0) {
        return `JR NC 0x${value.toString(16)}`;
      } else {
        return `JR NC -0x${(value * -1).toString(16)}`;
      }
    },
    byteDefinition: 0b00_110_000,
    cycleTime: !registers.flags.isCarry ? 3 : 2,
    byteLength: 2,
    execute() {
      if (!registers.flags.isCarry) {
        const jumpDistance = memory.readSignedByte(registers.programCounter.value);
        registers.programCounter.value++;
        registers.programCounter.value = registers.programCounter.value + jumpDistance;
      } else {
        registers.programCounter.value++;
      }
    }
  });

  jumpOperations.push({
    get instruction() {
      const value = memory.readSignedByte(registers.programCounter.value);
      if (value >= 0) {
        return `JR C 0x${value.toString(16)}`;
      } else {
        return `JR C -0x${(value * -1).toString(16)}`;
      }
    },
    byteDefinition: 0b00_111_000,
    cycleTime: registers.flags.isCarry ? 3 : 2,
    byteLength: 2,
    execute() {
      if (registers.flags.isCarry) {
        const jumpDistance = memory.readSignedByte(registers.programCounter.value);
        registers.programCounter.value++;
        registers.programCounter.value = registers.programCounter.value + jumpDistance;
      } else {
        registers.programCounter.value++;
      }
    }
  });

  jumpOperations.push({
    instruction: ' JP (HL)',
    byteDefinition: 0b11_101_001,
    cycleTime: 1,
    byteLength: 1,
    execute() {
      registers.programCounter.value = registers.HL.value;
    }
  });

  return jumpOperations;
}
